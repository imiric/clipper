import { Store, bind } from '../vendor/miu.min.js';
import { ORIGINAL_TEMPLATES } from '../lib/constants.js';
import { ValidationError } from '../lib/errors.js';
import { showStatus } from '../lib/utils.js';

// Compatibility layer for Chrome/Firefox
if (typeof browser === 'undefined') {
  globalThis.browser = chrome;
}

function loadFromStorage(store, cb) {
  browser.storage.sync.get(['templates', 'defaultTemplate']).then(data => {
    if (data.templates) {
      store.collection = data.templates;
    }
    if (data.defaultTemplate) {
      store.default = data.defaultTemplate;
    }
  })
  .then(cb)
  .catch(error => { cb(error) });
}

function saveToStorage(store, cb) {
  browser.storage.sync.set({
    templates: store.collection,
    defaultTemplate: store.default,
  })
  .then(cb)
  .catch(error => { cb(error) });
}

const templateStore = new Store('template', {
  collection: {},
  default: '',
})

let invalidInputTimeoutId;

const uiStore = new Store('ui', {
  templateName: '',
  templateContent: '',
  selected: '',
  // null: view mode; '': adding new template; 'template name': editing template
  editing: null,

  addTemplate() {
    this.templateName = '';
    this.editing = '';
  },

  deleteTemplate(event, bindCtx) {
    if (Object.keys(templateStore.collection).length === 1) {
      showStatus("Cannot delete the last template", 'var(--error-color)');
      return;
    }
    const optionEl = document.querySelector(`#template-select option[value="${this.selected}"]`);
    const nextSelected = optionEl.previousElementSibling?.value || optionEl.nextElementSibling.value;
    delete templateStore.collection[this.selected];
    this.selected = nextSelected;
  },

  editTemplate() {
    this.editing = this.selected;
  },

  saveChanges() {
    try {
      validateInput();
    } catch (error) {
      if (error instanceof ValidationError) {
        error.element.classList.add('invalid-input');
        clearTimeout(invalidInputTimeoutId);
        invalidInputTimeoutId = setTimeout(() => {
          error.element.classList.remove('invalid-input');
        }, 500);
        showStatus(error.message, 'var(--error-color)');
        return;
      }
      showStatus('Unexpected error. See console.', 'var(--error-color)');
      console.error('Unexpected error:', error)
      return false;
    }

    const templateName = document.getElementById('template-name').value.trim();
    const newTemplate = !hasKeyIgnoreCase(templateStore.collection, templateName);

    if (this.editing === '' && !newTemplate) {
      showStatus('Template with same name already exists', 'var(--error-color)');
      return false;
    }

    if (this.editing && templateName !== this.editing) {
      // We're editing a template and its name was changed. Delete it, since it
      // will be re-added with the new name below.
      delete templateStore.collection[this.editing];
      // Also update the default if the edited template was the default previously.
      if (templateStore.default === this.editing) {
        templateStore.default = templateName;
      }
    }

    templateStore.collection[templateName] = this.templateContent;
    this.selected = templateName;
    this.editing = null;

    if (newTemplate) {
      sortTemplates();
    }

    return true;
  },

  discardChanges() {
    this.templateContent = templateStore.collection[this.selected];
    this.editing = null;
  },

  selectTemplate(event) {
    templateStore.collection[this.selected] = this.templateContent;
    this.selected = event.target.value;
  },

  saveSettings(event) {
    if (this.editing !== null) {
      if (!this.saveChanges()) {
        return;
      }
      this.editing = null;
    } else {
      templateStore.collection[this.selected] = this.templateContent;
    }
    templateStore.default = this.selected;

    saveToStorage(templateStore, () => {
      showStatus('Settings saved', 'var(--success-color)');
    });
  },

  optionText(bindCtx) {
    let text = bindCtx.key;
    if (bindCtx.key === templateStore.default) {
      text += ' (default)';
    }
    return text;
  },

  restoreOriginal() {
    for (const name in ORIGINAL_TEMPLATES) {
      templateStore.collection[name] = ORIGINAL_TEMPLATES[name];
    }
    sortTemplates();
    this.templateContent = templateStore.collection[this.selected];
    showStatus('Original templates restored', 'var(--success-color)');
  },
});

uiStore.$subscribe('editing', (value) => {
  const templateSelect = document.getElementById('template-select');
  const templateName = document.getElementById('template-name');
  const templateContent = document.getElementById('template-content');
  const manageButtons = document.querySelector('.button-group.manage');
  const editButtons = document.querySelector('.button-group.edit');

  const isEditing = value !== null;

  templateSelect.style.display = isEditing ? 'none' : 'flex';
  templateName.style.display = isEditing ? 'flex' : 'none';
  templateContent.disabled = !isEditing;
  manageButtons.style.display = isEditing ? 'none' : 'flex';
  editButtons.style.display = isEditing ? 'flex' : 'none';
  if (isEditing) {
    if (value) {
      uiStore.templateName = uiStore.editing;
      uiStore.templateContent = templateStore.collection[uiStore.editing];
    } else {
      uiStore.templateContent = '';
    }
    templateName.focus();
  }
});

uiStore.$subscribe('selected', (value) => {
  uiStore.templateContent = templateStore.collection[value];
  document.querySelector('#template-select').value = value;
});

// Hack to trigger updates of the select option text that marks the default
// template whenever it changes. Ideally Miu should support computed values
// properly and keep track of these dependencies internally, but that's a
// complexity that I wish to avoid for now.
templateStore.$subscribe('default', (value) => {
  uiStore.optionText = uiStore.optionText;
});

bind(document.body, [templateStore, uiStore]);

function validateInput() {
  const name = document.getElementById('template-name');
  if (!name.value.trim()) {
    throw new ValidationError(name, 'Empty template name');
  }

  const content = document.getElementById('template-content');
  if (!content.value) {
    throw new ValidationError(content, 'Empty template content');
  }
}

const hasKeyIgnoreCase = (obj, key) =>
    Object.keys(obj).some(k => k.toLowerCase() === key.toLowerCase());

const sortTemplates = () => {
  const prevSelected = uiStore.selected;
  templateStore.collection = Object.fromEntries(
    Object.entries(templateStore.collection).sort((a, b) => a[0].localeCompare(b[0]))
  );
  uiStore.selected = prevSelected;
}

loadFromStorage(templateStore, () => {
  uiStore.templateName = templateStore.default;
  uiStore.templateContent = templateStore.collection[templateStore.default];
  uiStore.selected = templateStore.default;
  sortTemplates();
});
