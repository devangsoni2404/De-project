import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const STATUS = {
  PENDING: 'Pending',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled'
};

const STATUS_BADGE_VARIANTS = {
  [STATUS.PENDING]: 'warning',
  [STATUS.FULFILLED]: 'success',
  [STATUS.CANCELLED]: 'danger'
};

const errorMessages = {
  403: 'You are not authorized to perform this action',
  404: 'Prescription not found',
  500: 'Server error'
};

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [userRole, setUserRole] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return token;
  }, []);

  const api = useCallback(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  }, [getToken]);

  useEffect(() => {
    try {
      const decoded = jwtDecode(getToken());
      setUserRole(decoded.role);
    } catch (err) {
      console.error('Token decode error:', err);
      setError('Invalid or expired token');
    }
  }, [getToken]);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api().get('/api/prescriptions');
      setPrescriptions(res.data);
    } catch (err) {
      const status = err.response?.status;
      const message = status ? errorMessages[status] || err.response?.data?.message : 'Failed to fetch prescriptions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError('');
      setSuccess('');

      const res = await api().patch(`/api/prescriptions/${id}`, { status });

      setSuccess(res.data.message);
      fetchPrescriptions();
    } catch (err) {
      const status = err.response?.status;
      const message = status ? errorMessages[status] || err.response?.data?.message : 'Failed to update prescription';
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0 text-center text-white">Pharmacist Dashboard</h2>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
              <p>Loading prescriptions...</p>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Medicines</th>
                  {userRole === 'pharmacist' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {prescriptions.length > 0 ? prescriptions.map(p => (
                  <tr key={p._id}>
                    <td>{p.patientName}</td>
                    <td>
                      <Badge bg={STATUS_BADGE_VARIANTS[p.status]}>
                        {p.status}
                      </Badge>
                    </td>
                    <td>
                      {p.medicines.map((m, i) => (
                        <div key={i}>{m.name} ({m.dosage})</div>
                      ))}
                    </td>
                    {userRole === 'pharmacist' && (
                      <td>
                        {p.status === STATUS.PENDING && (
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => updateStatus(p._id, STATUS.FULFILLED)}
                              disabled={updatingId === p._id}
                            >
                              {updatingId === p._id ? <Spinner size="sm" animation="border" /> : 'Fulfill'}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => updateStatus(p._id, STATUS.CANCELLED)}
                              disabled={updatingId === p._id}
                            >
                              {updatingId === p._id ? <Spinner size="sm" animation="border" /> : 'Cancel'}
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={userRole === 'pharmacist' ? 4 : 3} className="text-center">
                      No prescriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
