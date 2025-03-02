// Compatibility layer for Chrome/Firefox
if (typeof browser === "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

browser.action.onClicked.addListener((tab) => {
  browser.storage.sync.get({ headlineLevel: 3 }).then(options => {
    browser.scripting.executeScript({
      target: {tabId: tab.id},
      func: copyToClipboard,
      args: [options.headlineLevel]
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
});

function copyToClipboard(headlineLevel) {
  const title = document.title;
  const url = document.location.href;
  const headlineStars = '*'.repeat(headlineLevel);
  const orgFormat = `${headlineStars} ${title}\n:PROPERTIES:\n:url: ${url}\n:END:\n\n`;

  return navigator.clipboard.writeText(orgFormat)
    .then(() => true)
    .catch(err => {
      console.error('Failed to copy: ', err);
      return false;
    });
}
