// Note: We'll generate QR codes on frontend, but this can be used for server-side generation
import QRCode from 'qrcode';

export const generateQRBase64 = async (text, options = {}) => {
  try {
    const qrOptions = {
      errorCorrectionLevel: options.errorLevel || 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: options.foregroundColor || '#000000',
        light: options.backgroundColor || '#FFFFFF'
      },
      width: options.size || 300
    };

    return await QRCode.toDataURL(text, qrOptions);
  } catch (error) {
    console.error('QR Generation Error:', error);
    throw error;
  }
};