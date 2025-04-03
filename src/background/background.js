import { ORIGINAL_TEMPLATES } from '../lib/constants.js';

// Compatibility layer for Chrome/Firefox
if (typeof browser === "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    browser.storage.sync.set({
      templates: ORIGINAL_TEMPLATES,
      defaultTemplate: "Plain"
    });
  }
});

browser.action.onClicked.addListener((tab) => {
  browser.storage.sync.get(["templates", "defaultTemplate"]).then(options => {
    // Get the default template or fall back to another available one
    let templateContent = options.templates[options.defaultTemplate];

    // Fallback in case the default template doesn't exist
    if (!templateContent) {
      const templateNames = Object.keys(options.templates);
      if (templateNames.length > 0) {
        templateContent = options.templates[templateNames[0]];
      } else {
        templateContent = ORIGINAL_TEMPLATES["Plain"];
      }
    }

    browser.scripting.executeScript({
      target: {tabId: tab.id},
      func: copyToClipboard,
      args: [templateContent]
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

function copyToClipboard(templateString) {
  const formattedText = templateString
    .replace(/\$TITLE/g, document.title)
    .replace(/\$URL/g, document.location.href);

  return navigator.clipboard.writeText(formattedText)
    .then(() => true)
    .catch(err => {
      console.error('Failed to copy: ', err);
      return false;
    });
}
