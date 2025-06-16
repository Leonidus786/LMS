import React, { useState, useEffect } from "react";

const NotificationPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Auto-close notification after 10 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in">
      <p className="font-semibold">{message}</p>
      <button onClick={onClose} className="mt-2 text-sm underline">
        Dismiss
      </button>
    </div>
  );
};

export default NotificationPopup;
