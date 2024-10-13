let sidebarOpen = false;
let sidebar;
let currentTooltip = null;

function createSidebar() {
  sidebar = document.createElement('iframe');
  sidebar.src = chrome.runtime.getURL('index.html');
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100%;
    z-index: 9999;
    border: none;
    transition: right 0.3s ease-in-out;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  `;
  document.body.appendChild(sidebar);
}

function toggleSidebar() {
  if (!sidebar) {
    createSidebar();
  }
  
  sidebarOpen = !sidebarOpen;
  sidebar.style.right = sidebarOpen ? '0' : '-300px';
}


function copyToClipboard(text, key) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        chrome.runtime.sendMessage({ type: 'copyResult', success: true, key });
      })
      .catch(err => {
        chrome.runtime.sendMessage({ type: 'copyResult', success: false, error: err.message, key });
      });
  } else {
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      chrome.runtime.sendMessage({ type: 'copyResult', success: true, key });
    } catch (err) {
      chrome.runtime.sendMessage({ type: 'copyResult', success: false, error: err.message, key });
    }
    document.body.removeChild(textArea);
  }
}

// Add a message listener for copy requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'copyToClipboard') {
    copyToClipboard(message.text, message.key);
  }
});

// Function to display the margin and padding
function showElementSpacing(element) {
  const styles = window.getComputedStyle(element);

  const margin = {
    top: styles.marginTop,
    right: styles.marginRight,
    bottom: styles.marginBottom,
    left: styles.marginLeft,
  };

  const padding = {
    top: styles.paddingTop,
    right: styles.paddingRight,
    bottom: styles.paddingBottom,
    left: styles.paddingLeft,
  };

  showTooltip(element, margin, padding);
  highlightElement(element);
}

// Updated function to highlight the element
function highlightElement(element) {
  const originalOutline = element.style.outline;
  const originalOutlineOffset = element.style.outlineOffset;
  
  element.style.outline = '2px solid #ff6347';
  element.style.outlineOffset = '1px';

  const removeHighlight = () => {
    element.style.outline = originalOutline;
    element.style.outlineOffset = originalOutlineOffset;
    element.removeEventListener('mouseleave', removeHighlight);
  };

  element.addEventListener('mouseleave', removeHighlight);
}

// Function to display a tooltip with the margin and padding information
function showTooltip(element, margin, padding) {
  // Remove existing tooltip if any
  if (currentTooltip) {
    currentTooltip.remove();
  }

  const tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '5px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.zIndex = '10000';
  tooltip.style.pointerEvents = 'none';
  
  tooltip.innerHTML = `
    <strong>Margin:</strong><br>
    Top: ${margin.top}, Right: ${margin.right}, Bottom: ${margin.bottom}, Left: ${margin.left}<br>
    <strong>Padding:</strong><br>
    Top: ${padding.top}, Right: ${padding.right}, Bottom: ${padding.bottom}, Left: ${padding.left}
  `;

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;

  const updateTooltipPosition = (e) => {
    const x = e.clientX + 10;
    const y = e.clientY + 10;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  element.addEventListener('mousemove', updateTooltipPosition);

  element.addEventListener('mouseleave', () => {
    tooltip.remove();
    currentTooltip = null;
    element.removeEventListener('mousemove', updateTooltipPosition);
  }, { once: true });
}

let marginPaddingFinderActive = false;

function activateMarginPaddingFinder() {
  if (!marginPaddingFinderActive) {
    document.addEventListener('mouseover', handleMouseOver);
    marginPaddingFinderActive = true;
  }
}

function deactivateMarginPaddingFinder() {
  if (marginPaddingFinderActive) {
    document.removeEventListener('mouseover', handleMouseOver);
    marginPaddingFinderActive = false;
  }
}

function handleMouseOver(event) {
  const hoveredElement = event.target;
  if (hoveredElement.tagName !== 'BODY' && hoveredElement.tagName !== 'HTML') {
    showElementSpacing(hoveredElement);
    highlightElement(hoveredElement);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_sidebar") {
    toggleSidebar();
  } else if (request.action === "activate_margin_padding_finder") {
    activateMarginPaddingFinder();
  } else if (request.action === "deactivate_margin_padding_finder") {
    deactivateMarginPaddingFinder();
  }
});

// Create the sidebar when the content script loads
createSidebar();
