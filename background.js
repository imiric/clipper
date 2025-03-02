chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: copyToClipboard,
  }).then(() => {
    // Show visual feedback by setting a badge
    chrome.action.setBadgeText({text: "✓", tabId: tab.id});
    chrome.action.setBadgeBackgroundColor({color: "#4CAF50", tabId: tab.id});

    // Clear the badge after 1.5 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({text: "", tabId: tab.id});
    }, 1500);
  });
});

function copyToClipboard() {
  const title = document.title;
  const url = document.location.href;

  const orgFormat = `*** ${title}\n:PROPERTIES:\n:url: ${url}\n:END:\n\n`;

  return navigator.clipboard.writeText(orgFormat);
}
