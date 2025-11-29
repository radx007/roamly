import React, { useState, useEffect } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import { watchlistApi } from '../../api/watchlistApi';
import Loader from '../common/Loader';

const WatchlistQRCode = ({ watchlistId, onClose }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlistId]);

  const loadQRCode = async () => {
    try {
      const { data } = await watchlistApi.getQRCode(watchlistId);
      if (data && data.data) {
        setQrCode(data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to load QR code:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `watchlist-${watchlistId}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">Share Watchlist</h2>
          <button onClick={onClose} className="text-white hover:text-primary transition">
            <FiX size={24} />
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              QR code generation is not available for this watchlist.
            </p>
            <p className="text-gray-500 text-sm">
              Make sure the watchlist is public to generate a QR code.
            </p>
          </div>
        ) : qrCode ? (
          <div className="text-center">
            <img src={qrCode} alt="Watchlist QR Code" className="mx-auto mb-4 max-w-full" />
            <p className="text-gray-300 mb-4">
              Scan this QR code to share your watchlist
            </p>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FiDownload />
              <span>Download QR Code</span>
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Failed to generate QR code</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistQRCode;
