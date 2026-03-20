import QRCode from '../models/QRCode.js';

// @desc    Create a new QR code
// @route   POST /api/qr
export const createQRCode = async (req, res) => {
  try {
    const { title, type, content, config, isDynamic } = req.body;

    const qrCode = await QRCode.create({
      user: req.user._id,
      title,
      type,
      content,
      config,
      isDynamic,
      // If dynamic, create a unique URL for redirection
      dynamicUrl: isDynamic ? `${process.env.BASE_URL || 'http://localhost:5000'}/r/${Date.now()}` : null
    });

    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all QR codes for user
// @route   GET /api/qr
export const getUserQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ user: req.user._id }).sort('-createdAt');
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single QR code
// @route   GET /api/qr/:id
export const getQRCodeById = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (qrCode && qrCode.user.toString() === req.user._id.toString()) {
      res.json(qrCode);
    } else {
      res.status(404).json({ message: 'QR Code not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update QR code
// @route   PUT /api/qr/:id
export const updateQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode || qrCode.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Update fields
    qrCode.title = req.body.title || qrCode.title;
    qrCode.content = req.body.content || qrCode.content;
    qrCode.config = req.body.config || qrCode.config;
    
    if (qrCode.isDynamic && req.body.redirectUrl) {
      qrCode.dynamicUrl = req.body.redirectUrl;
    }

    const updatedQR = await qrCode.save();
    res.json(updatedQR);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete QR code
// @route   DELETE /api/qr/:id
export const deleteQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode || qrCode.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    await qrCode.deleteOne();
    res.json({ message: 'QR Code removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track QR code scan (for dynamic QR codes)
// @route   GET /r/:id
export const trackQRScan = async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ dynamicUrl: `http://localhost:5000/r/${req.params.id}` });

    if (!qrCode) {
      return res.status(404).send('QR Code not found');
    }

    // Update scan count
    qrCode.scans += 1;
    
    // Add scan history (simplified)
    qrCode.scanHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await qrCode.save();

    // Redirect to the actual URL
    res.redirect(qrCode.content.url || qrCode.content);
  } catch (error) {
    res.status(500).send('Server error');
  }
};