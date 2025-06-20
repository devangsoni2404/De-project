import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/prescriptions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ Corrected format
        },
      });
      setPrescriptions(res.data);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized access. Please log in again.'
          : 'Failed to fetch prescriptions.'
      );
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="container py-4">
      <Card className="shadow mb-4">
        <Card.Header className="bg-primary text-white text-center">
          <h2 className="mb-0 text-white text-center">Patient Dashboard</h2>
        </Card.Header>
      </Card>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {prescriptions.map((p) => (
        <div key={p._id} className="card mb-4 shadow-sm prescription-card">
          <div className="card-body">
            <h5 className="card-title mb-2">Doctor ID: {p.doctorId}</h5>
            <p className="card-text">
              <strong>Medicines:</strong>
              <ul className="list-unstyled ms-3">
                {p.medicines.map((m, i) => (
                  <li key={i}>
                    {m.name} - {m.dosage}, {m.frequency}
                  </li>
                ))}
              </ul>
              <strong>Status:</strong>{' '}
              <span
                className={`badge ${
                  p.status === 'Pending'
                    ? 'bg-warning text-dark'
                    : p.status === 'Cancelled'
                    ? 'bg-danger'
                    : 'bg-success'
                }`}
              >
                {p.status}
              </span>
              <br />
              <strong>Notes:</strong> {p.notes}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
