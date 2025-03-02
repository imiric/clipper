// Compatibility layer for Chrome/Firefox
if (typeof browser === "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

browser.action.onClicked.addListener((tab) => {
  browser.scripting.executeScript({
    target: {tabId: tab.id},
    func: copyToClipboard
  }).then(() => {
    // Show visual feedback
    browser.action.setBadgeText({text: "✓", tabId: tab.id});
    browser.action.setBadgeBackgroundColor({color: "#4CAF50", tabId: tab.id});

    // Clear the badge after 1.5 seconds
    setTimeout(() => {
      browser.action.setBadgeText({text: "", tabId: tab.id});
    }, 1500);
  });
});

function copyToClipboard() {
  const title = document.title;
  const url = document.location.href;
  const orgFormat = `*** ${title}\n:PROPERTIES:\n:url: ${url}\n:END:\n\n`;

  return navigator.clipboard.writeText(orgFormat)
    .then(() => true)
    .catch(err => {
      console.error('Failed to copy: ', err);
      return false;
    });
}
