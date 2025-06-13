import React from 'react';

const Notification = ({ type, message, onClose }) => {
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-l-4 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-l-4 border-red-500 text-red-700';
      case 'info':
        return 'bg-blue-100 border-l-4 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-l-4 border-gray-500 text-gray-700';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        );
      case 'error':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        );
      case 'info':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-in-out ${getNotificationStyle(type)}`}>
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {getNotificationIcon(type)}
        </svg>
        <div>
          <p className="font-semibold">
            {type === 'error' ? 'Atenção!' :
              type === 'success' ? 'Sucesso!' : 'Informação'}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification; 