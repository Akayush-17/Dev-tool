/* global chrome */
import React, { useEffect, useState } from 'react';

const MarginPaddingFinder = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const sendMessage = (action) => {
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action });
          }
        });
      }
    };

    // Send a message to the content script to activate the margin/padding finder
    sendMessage("activate_margin_padding_finder");
    setIsActive(true);

    // Clean up function
    return () => {
      sendMessage("deactivate_margin_padding_finder");
      setIsActive(false);
    };
  }, []);

  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
      {isActive ? (
        <p className='mt-4'>Margin/Padding finder is active. Hover over elements to see their margin and padding. Elements will be highlighted when inspected.</p>
      ) : (
        <p className='mt-4'>Margin/Padding finder is inactive.</p>
      )}
    </div>
  );
};

export default MarginPaddingFinder;
