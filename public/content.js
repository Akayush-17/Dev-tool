let sidebarOpen = false;
let sidebar;

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_sidebar") {
    toggleSidebar();
  }
});

// Create the sidebar when the content script loads
createSidebar();

