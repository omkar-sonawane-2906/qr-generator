import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My QR Code'
  },
  type: {
    type: String,
    enum: ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can store different structures per type
    required: true
  },
  // QR Code configuration
  config: {
    size: { type: Number, default: 300 },
    foregroundColor: { type: String, default: '#000000' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    logoUrl: { type: String, default: null },
    logoWidth: { type: Number, default: 60 },
    errorLevel: { 
      type: String, 
      enum: ['L', 'M', 'Q', 'H'],
      default: 'M'
    },
    qrStyle: {
      type: String,
      enum: ['squares', 'dots'],
      default: 'squares'
    },
    // Find the eyeRadius section in your schema and update it to:
eyeRadius: {
  type: [{
    outer: { type: Number, default: 0 },
    inner: { type: Number, default: 0 }
  }],
  default: [
    { outer: 0, inner: 0 },
    { outer: 0, inner: 0 },
    { outer: 0, inner: 0 }
  ]
}
  },
  // Dynamic QR fields
  isDynamic: {
    type: Boolean,
    default: false
  },
  dynamicUrl: {
    type: String,
    default: null
  },
  // Analytics
  scans: {
    type: Number,
    default: 0
  },
  scanHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
      location: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
qrCodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);
export default QRCode;