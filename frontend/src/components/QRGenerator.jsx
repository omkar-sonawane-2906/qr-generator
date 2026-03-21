import React, { useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { saveAs } from 'file-saver';
import toast, { Toaster } from 'react-hot-toast';

const QRGenerator = () => {
  const qrRef = useRef();
  
  // QR Data States
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrType, setQrType] = useState('url');
  const [title, setTitle] = useState('My QR Code');
  
  // QR Customization States
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [logoImage, setLogoImage] = useState(null);
  const [logoWidth, setLogoWidth] = useState(60);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrStyle, setQrStyle] = useState('squares');
  const [eyeRadius, setEyeRadius] = useState(0);
  
  // WiFi and vCard data
  const [wifiData, setWifiData] = useState({ ssid: '', encryption: 'WPA', password: '' });
  const [vcardData, setVcardData] = useState({ name: '', phone: '', email: '' });

  // Handle different QR types
  const getFormattedContent = () => {
    switch(qrType) {
      case 'url':
        return qrValue;
      case 'text':
        return qrValue;
      case 'email':
        return `mailto:${qrValue}`;
      case 'phone':
        return `tel:${qrValue}`;
      case 'sms':
        return `sms:${qrValue}`;
      case 'wifi':
        return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
      default:
        return qrValue;
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download QR code
  const downloadQR = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          saveAs(blob, `${title || 'qr-code'}.png`);
          toast.success('QR code downloaded!');
        });
      } else {
        toast.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create QR Codes Instantly
        </h1>
        <p className="text-lg text-gray-600">
          Free, no registration required. Customize colors, add logos, and download instantly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - QR Code Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
          <h2 className="text-xl font-semibold mb-4 text-center">Your QR Code</h2>
          <div className="flex justify-center mb-4">
            <div className="border-2 border-gray-200 p-4 rounded-lg inline-block bg-white">
              <QRCode
                ref={qrRef}
                value={getFormattedContent()}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                logoImage={logoImage}
                logoWidth={logoWidth}
                logoOpacity={1}
                qrStyle={qrStyle}
                eyeRadius={eyeRadius}
                ecLevel={errorLevel}
                removeQrCodeBehindLogo={true}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={downloadQR}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold"
            >
              Download QR Code (PNG)
            </button>
          </div>
        </div>

        {/* Right Column - Customization Panel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Customize Your QR Code</h2>
          
          {/* QR Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Type
            </label>
            <select
              value={qrType}
              onChange={(e) => setQrType(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="url">URL / Link</option>
              <option value="text">Plain Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="sms">SMS</option>
              <option value="wifi">Wi-Fi Network</option>
              <option value="vcard">vCard (Business Card)</option>
            </select>
          </div>

          {/* Content Input - Dynamic based on type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrType === 'url' && 'Enter URL'}
              {qrType === 'text' && 'Enter Text'}
              {qrType === 'email' && 'Enter Email Address'}
              {qrType === 'phone' && 'Enter Phone Number'}
              {qrType === 'sms' && 'Enter Phone Number'}
              {qrType === 'wifi' && 'Wi-Fi Network Details'}
              {qrType === 'vcard' && 'Contact Details'}
            </label>
            
            {qrType === 'wifi' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Network Name (SSID)"
                  value={wifiData.ssid}
                  onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <select
                  value={wifiData.encryption}
                  onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
                <input
                  type="password"
                  placeholder="Password"
                  value={wifiData.password}
                  onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            ) : qrType === 'vcard' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={vcardData.name}
                  onChange={(e) => setVcardData({ ...vcardData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={vcardData.phone}
                  onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={vcardData.email}
                  onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            ) : (
              <input
                type={qrType === 'email' ? 'email' : 'text'}
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                placeholder={`Enter ${qrType}`}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Name (for download file)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter name for your QR code"
            />
          </div>

          {/* Size Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size: {size}px
            </label>
            <input
              type="range"
              min="128"
              max="1024"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foreground Color
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
          </div>

          {/* QR Style */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Style
            </label>
            <select
              value={qrStyle}
              onChange={(e) => setQrStyle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="squares">Squares</option>
              <option value="dots">Dots</option>
            </select>
          </div>

          {/* Eye Radius */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Corner Radius: {eyeRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={eyeRadius}
              onChange={(e) => setEyeRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Error Correction Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Error Correction Level
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="L">Low (7%) - Best for simple QR codes</option>
              <option value="M">Medium (15%) - Good balance</option>
              <option value="Q">Quartile (25%) - Better with logos</option>
              <option value="H">High (30%) - Best with logos</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {logoImage && (
              <button
                onClick={() => setLogoImage(null)}
                className="mt-2 text-red-600 text-sm hover:text-red-700"
              >
                Remove Logo
              </button>
            )}
          </div>

          {/* Logo Size */}
          {logoImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Size: {logoWidth}px
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={logoWidth}
                onChange={(e) => setLogoWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;