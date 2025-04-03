let statusTimeoutId;

export function showStatus(message, color) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = color;

  clearTimeout(statusTimeoutId);
  statusTimeoutId = setTimeout(() => {
    status.textContent = '';
  }, 2000);
}
