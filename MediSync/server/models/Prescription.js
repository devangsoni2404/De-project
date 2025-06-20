const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  doctorId: String,
  patientId: String,
  patientName: String,
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  notes: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);