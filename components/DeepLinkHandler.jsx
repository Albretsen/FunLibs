import React, { useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';

const DeepLinkHandler = ({ onDeepLink }) => {

  const handleDeepLink = useCallback((event) => {
    let { path, queryParams } = Linking.parse(event.url);

    if (onDeepLink) {
      onDeepLink({ path, queryParams });
    }
  }, [onDeepLink]);

  useEffect(() => {
    // Listen for incoming deep links
    Linking.addEventListener('url', handleDeepLink);

    // Remove the listener when the component unmounts
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [handleDeepLink]);

  return null; // This component doesn't render anything
};

export default DeepLinkHandler;