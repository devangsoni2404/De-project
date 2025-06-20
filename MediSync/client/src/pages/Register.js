import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'doctor' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Navigate to login after success
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={8} sm={6} md={5} lg={4} className="mx-auto">
          <Card className="shadow-sm" style={{ borderRadius: '8px' }}>
            <Card.Header className="bg-primary text-white text-center py-2">
              <h6>Register</h6>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form>
                <Form.Group controlId="formName" className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                    size="sm"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="patient">Patient</option>
                  </Form.Control>
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 mt-2"
                  onClick={register}
                  size="sm"
                >
                  Register
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center py-1">
              <small>Already have an account? <a href="/login">Login</a></small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
