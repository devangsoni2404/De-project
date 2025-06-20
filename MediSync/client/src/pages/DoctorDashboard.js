import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DoctorDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({
    patientName: '',
    medicines: [{ name: '', dosage: '', frequency: '' }],
    notes: '',
  });

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/prescriptions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPrescriptions(res.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      alert('Failed to fetch prescriptions. Please login again or check your token.');
    }
  };

  const addPrescription = async () => {
    try {
      await axios.post('http://localhost:5000/api/prescriptions', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },   
      });
      fetchPrescriptions();
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription. Please check your input or authentication.');
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Doctor Dashboard</h2>

      {/* New Prescription Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">New Prescription</h5>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          />
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Medicine Name"
              value={form.medicines[0].name}
              onChange={(e) =>
                setForm({
                  ...form,
                  medicines: [{ ...form.medicines[0], name: e.target.value }],
                })
              }
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Dosage"
              value={form.medicines[0].dosage}
              onChange={(e) =>
                setForm({
                  ...form,
                  medicines: [{ ...form.medicines[0], dosage: e.target.value }],
                })
              }
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Frequency"
              value={form.medicines[0].frequency}
              onChange={(e) =>
                setForm({
                  ...form,
                  medicines: [{ ...form.medicines[0], frequency: e.target.value }],
                })
              }
            />
          </div>
        </div>

        <div className="mt-3">
          <input
            className="form-control"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button className="btn btn-primary mt-3" onClick={addPrescription}>
          Add Prescription
        </button>
      </div>

      {/* Prescriptions List */}
      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">Prescriptions</h5>
        <ul className="list-group">
          {prescriptions.map((p) => (
            <li key={p._id} className="list-group-item d-flex justify-content-between">
              <span><strong>{p.patientName}</strong></span>
              <span className={`badge ${p.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
