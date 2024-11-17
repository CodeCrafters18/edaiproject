import mongoose, { Schema } from 'mongoose';

const StorageRentalSchema = new Schema({
  areaLength: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
  areaWidth: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
  climate: {
    type: String,
    required: true,
    enum: ['cold', 'moderate', 'hot'],
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  storageType: {
    type: String,
    required: true,
    enum: ['warehouse', 'silo', 'coldStorage', 'openYard'],
  },
  securityFeatures: {
    type: String,
    default: '',
  },
  availabilityPeriod: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('StorageRental', StorageRentalSchema);