// Compatibility layer for Chrome/Firefox
if (typeof browser === "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

// Save options to browser.storage
function saveOptions(e) {
  e.preventDefault();
  const headlineLevel = parseInt(document.getElementById('headline-level').value, 10);
  const status = document.getElementById('status');

  if (isNaN(headlineLevel) || headlineLevel < 1 || headlineLevel > 6) {
    status.textContent = 'Error: Please enter a number between 1 and 6';
    status.style.color = 'red';
    return false;
  }

  browser.storage.sync.set({ headlineLevel })
    .then(() => {
      status.textContent = 'Options saved.';
      status.style.color = '';  // Reset to default color
      setTimeout(() => { status.textContent = ''; }, 750);
    });
}

// Restore saved options
function restoreOptions() {
  browser.storage.sync.get({ headlineLevel: 3 })
    .then((options) => {
      document.getElementById('headline-level').value = options.headlineLevel;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
