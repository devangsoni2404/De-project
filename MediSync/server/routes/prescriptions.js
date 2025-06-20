const express = require('express');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate JWT token
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      console.error('JWT error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ✅ Create new prescription (Doctor only)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Create prescription request by:', req.user);

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    const { patientName, medicines, notes } = req.body;

    if (!patientName || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: 'All fields are required and medicines must be a non-empty array.' });
    }

    const patient = await User.findOne({ name: patientName, role: 'patient' });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const prescription = new Prescription({
      doctorId: req.user.id,
      patientId: patient._id,
      patientName,
      medicines,
      notes,
      status: 'Pending',
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created successfully' });
  } catch (err) {
    console.error('Error creating prescription:', err);
    res.status(500).json({ message: 'Server error while creating prescription' });
  }
});

// ✅ Get prescriptions (role-based)
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetch prescriptions request by:', req.user);
    let prescriptions;

    if (req.user.role === 'doctor') {
      prescriptions = await Prescription.find({ doctorId: req.user.id });
    } else if (req.user.role === 'pharmacist') {
      prescriptions = await Prescription.find();
    } else if (req.user.role === 'patient') {
      prescriptions = await Prescription.find({ patientId: req.user.id });
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).json({ message: 'Server error while fetching prescriptions' });
  }
});

// ✅ Update prescription (Pharmacist only)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pharmacist') {
      return res.status(403).json({ message: 'Only pharmacists can update prescriptions' });
    }

    const updated = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({ message: 'Prescription updated successfully', updated });
  } catch (err) {
    console.error('Error updating prescription:', err);
    res.status(500).json({ message: 'Server error while updating prescription' });
  }
});

module.exports = router;
