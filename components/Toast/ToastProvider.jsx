import React, { useState } from 'react';
import Toast from './Toast';
import ToastContext from './ToastContext';
import { KeyboardAvoidingView, Platform } from 'react-native';

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState(null);

  const showToast = (title, message) => {
    setTitle(title)
    setMessage(message);
    setTimeout(() => {
        setTitle(null);
      setMessage(null);
    }, 8000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
      >
        {message && <Toast title={title} message={message} />}
      </KeyboardAvoidingView>
    </ToastContext.Provider>
  );
};

export default ToastProvider;