import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const ScanRFID = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-reader');

    const startScanning = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              setScanResult(decodedText);
              setIsScanning(false);
              html5QrCode.stop();
            },
            (errorMessage) => {
              setError(`Scan error: ${errorMessage}`);
            }
          );
          setIsScanning(true);
        } else {
          setError('No cameras found.');
        }
      } catch (err) {
        setError(`Camera access error: ${err.message}`);
      }
    };

    if (isScanning) {
      startScanning();
    }

    return () => {
      if (isScanning) {
        html5QrCode.stop().catch((err) => console.error('Stop error:', err));
      }
    };
  }, [isScanning]);

  const handleStartScan = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">QR Code Scanner</h1>
      <div
        id="qr-reader"
        className="w-full max-w-md border-4 border-blue-500 rounded-lg mb-4"
        style={{ display: isScanning ? 'block' : 'none' }}
      ></div>
      {isScanning ? (
        <p className="text-lg text-gray-600">Scanning...</p>
      ) : (
        <button
          onClick={handleStartScan}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Start QR Scan
        </button>
      )}
      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg w-full max-w-md">
          <p className="text-lg font-semibold text-green-800">Scanned Result:</p>
          <p className="text-gray-800 break-all">{scanResult}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg w-full max-w-md">
          <p className="text-lg font-semibold text-red-800">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ScanRFID;