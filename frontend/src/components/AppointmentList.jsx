import React, { useState } from 'react';
import { updateAppointment, deleteAppointment } from '../services/api';

export default function AppointmentList({
  appointments,
  user,
  token,
  onRefresh,
}) {
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateAppointment(id, { status: newStatus }, token);
      if (res.appointment) {
        onRefresh();
      } else {
        setActionError(res.message || 'Failed to update status');
      }
    } catch (err) {
      setActionError('Error updating appointment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await deleteAppointment(id, token);
      if (res.message) {
        onRefresh();
      } else {
        setActionError('Failed to delete appointment');
      }
    } catch (err) {
      setActionError('Error deleting appointment');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await updateAppointment(id, { status: 'Cancelled' }, token);
      if (res.appointment) {
        onRefresh();
      }
    } catch (err) {
      setActionError('Error cancelling appointment');
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge-confirmed';
      case 'completed':
        return 'badge-completed';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>
          {user.role === 'Admin'
            ? 'Manage All Appointments'
            : 'My Booked Appointments'}
        </h3>
        <span className="count-tag">{appointments.length} Total</span>
      </div>

      {actionError && <div className="alert-box error">{actionError}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td><strong>{appt.patientName}</strong></td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.department}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    {user.role === 'Admin' ? (
                      <select
                        className={`status-select ${getStatusClass(appt.status)}`}
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`badge ${getStatusClass(appt.status)}`}>
                        {appt.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {user.role === 'Admin' ? (
                      <button
                        className="btn-danger-sm"
                        onClick={() => handleDelete(appt._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      appt.status !== 'Cancelled' && (
                        <button
                          className="btn-warning-sm"
                          onClick={() => handleCancel(appt._id)}
                        >
                          Cancel
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
