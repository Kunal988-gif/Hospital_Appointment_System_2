import React, { useState } from 'react';
import { createAppointment } from '../services/api';

export default function BookAppointment({ user, token, onAppointmentCreated }) {
  const [patientName, setPatientName] = useState(user?.name || '');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await createAppointment(
        {
          patientName,
          doctorName,
          date,
          time,
          department,
        },
        token
      );

      if (res.appointment) {
        setMessage('Appointment booked successfully!');
        setDoctorName('');
        setDate('');
        setTime('');
        onAppointmentCreated();
      } else {
        setError(res.message || 'Failed to book appointment');
      }
    } catch (err) {
      setError('Network error while booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Book a Medical Appointment</h3>
      <p className="card-subtitle">Fill in the appointment details below</p>

      {message && <div className="alert-box success">{message}</div>}
      {error && <div className="alert-box error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Patient Name:</label>
          <input
            type="text"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. John Patient"
          />
        </div>

        <div className="form-group">
          <label>Doctor Name:</label>
          <input
            type="text"
            required
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="e.g. Dr. Sarah Jenkins"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department:</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Time Slot:</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
