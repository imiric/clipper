import { ORIGINAL_TEMPLATES } from '../lib/constants.js';

// Compatibility layer for Chrome/Firefox
if (typeof browser === "undefined") {
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

async function handleAction(tab) {
  const options = await browser.storage.sync.get(["templates", "defaultTemplate"]);
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

  await browser.scripting.executeScript({
    target: {tabId: tab.id},
    func: copyToClipboard,
    args: [templateContent]
  });

  // Show visual feedback
  browser.action.setBadgeText({text: "✓", tabId: tab.id});
  browser.action.setBadgeBackgroundColor({color: "#4CAF50", tabId: tab.id});

  // Clear the badge after 1.5 seconds
  setTimeout(() => {
    browser.action.setBadgeText({text: "", tabId: tab.id});
  }, 1500);
}

browser.action.onClicked.addListener(handleAction);

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

async function updateTemplateMenus() {
  await browser.contextMenus.removeAll();

  browser.contextMenus.create({
    id: "template-parent",
    title: "Copy using template",
    contexts: ["action"]
  });

  // Get templates from storage and create sub-menus
  const options = await browser.storage.sync.get(["templates", "defaultTemplate"])
  const templates = options.templates || {};
  const templateNames = Object.keys(templates).sort((a, b) => a.localeCompare(b));

  for (const templateName of templateNames) {
    let title = templateName;
    if (options.defaultTemplate === templateName) {
      title += ' (default)';
    }
    browser.contextMenus.create({
      id: `template-${templateName}`,
      parentId: "template-parent",
      title: title,
      contexts: ["action"]
    });
  }
}

updateTemplateMenus();

browser.storage.onChanged.addListener((changes) => {
  if (changes) {
    updateTemplateMenus();
  }
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.parentMenuItemId === "template-parent") {
    const templateName = info.menuItemId.replace('template-', '');
    await browser.storage.sync.set({ defaultTemplate: templateName });
    const storage = await browser.storage.sync.get('defaultTemplate');
    await handleAction(tab);
  }
});
