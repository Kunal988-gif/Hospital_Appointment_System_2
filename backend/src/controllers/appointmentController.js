const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { patientName, doctorName, date, time, department } = req.body;

    if (!patientName || !doctorName || !date || !time || !department) {
      return res.status(400).json({ message: 'All appointment fields are required' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ message: 'Appointment date cannot be in the past' });
    }

    const appointment = await Appointment.create({
      patientName,
      doctorName,
      date,
      time,
      department,
      userId: req.user.id,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to book appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== 'Admin') {
      query.userId = req.user.id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointment' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to update this appointment' });
    }

    if (req.body.status) {
      const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update appointment' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete appointment' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
