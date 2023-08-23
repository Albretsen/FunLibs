import React, { useState, useRef } from 'react';
import Toast from './Toast';
import ToastContext from './ToastContext';
import { KeyboardAvoidingView, Platform } from 'react-native';

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState(null);

  const toastTimerRef = useRef(null);

  const showToast = (message, title) => {
    setTitle(title);
    setMessage(message);
  
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
  
    toastTimerRef.current = setTimeout(() => {
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
        {message && <Toast title={title} message={message} setTitle={setTitle} setMessage={setMessage} />}
      </KeyboardAvoidingView>
    </ToastContext.Provider>
  );
};

export default ToastProvider;