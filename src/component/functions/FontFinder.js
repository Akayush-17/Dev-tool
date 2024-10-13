/* global chrome */

import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FontFinder = () => {
  const [fontDetails, setFontDetails] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [clipboardError, setClipboardError] = useState(false);

  useEffect(() => {
    // Execute script to inject selection listener when component mounts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: injectSelectionListener,
      });
    });

    // Set up message listener
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === 'fontDetails') {
        setFontDetails(message.details);
      } else if (message.type === 'copyResult') {
        if (message.success) {
          setCopiedStates(prev => ({ ...prev, [message.key]: true }));
          setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [message.key]: false }));
          }, 2000);
        } else {
          console.error('Failed to copy: ', message.error);
          setClipboardError(true);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // Function to request copy operation
  const requestCopy = (text, key = 'all') => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'copyToClipboard', text, key });
    });
  };

  const copyAllDetails = () => {
    if (!fontDetails) return;
    const detailsText = Object.entries(fontDetails)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    requestCopy(detailsText);
  };

  return (
    <div className="font-details p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Font Details</h2>
      {fontDetails ? (
        <div className="space-y-4">
          {Object.entries(fontDetails).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center">
                {key === 'Color' && (
                  <div 
                    className="w-6 h-6 rounded-full mr-2" 
                    style={{ backgroundColor: value }}
                  ></div>
                )}
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="ml-2 text-gray-600">{value}</span>
              </div>
              <button
                onClick={() => requestCopy(value, key)}
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                title="Copy to clipboard"
              >
                {copiedStates[key] ? <FaCheck className="h-4 w-4 text-green-500" /> : <FaCopy className="h-4 w-4" />}
              </button>
            </motion.div>
          ))}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyAllDetails}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaCopy className="mr-2" />
            Copy All Details
          </motion.button>
          {clipboardError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md flex items-center"
            >
              <FaExclamationTriangle className="mr-2" />
              <span>Unable to copy to clipboard. Please copy manually.</span>
            </motion.div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Select text on the page to see font details.</p>
      )}
    </div>
  );
};

// This function will be injected into the page to set up the selection listener
function injectSelectionListener() {
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      // Get the computed styles of the container or its parent element
      const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      const computedStyles = window.getComputedStyle(element);

      const fontDetails = {
        'Font Family': computedStyles.fontFamily,
        'Font Size': computedStyles.fontSize,
        'Font Weight': computedStyles.fontWeight,
        'Line Height': computedStyles.lineHeight,
        'Font Style': computedStyles.fontStyle,
        'Color': computedStyles.color,
      };

      // Convert color to hex
      const rgb = computedStyles.color.match(/\d+/g);
      if (rgb) {
        const hex = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        fontDetails['Color'] = hex;
      }

      chrome.runtime.sendMessage({ type: 'fontDetails', details: fontDetails });
    }
  });
}

export default FontFinder;
