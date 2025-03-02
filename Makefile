EXTENSION_NAME := org-clipper
COMMON_FILES := background.js options.html options.js
VERSION := $(shell git describe --tags --abbrev=10 --always --dirty | sed 's/^v//')

.PHONY: all
all: build

.PHONY: build
build: chrome firefox

.PHONY: chrome
chrome:
	@echo "Packaging $(EXTENSION_NAME)-$(VERSION).zip for Chrome..."
	@zip -r $(EXTENSION_NAME)-$(VERSION).zip $(COMMON_FILES) manifest-chrome.json
	@printf "@ manifest-chrome.json\n@=manifest.json\n" | zipnote -w $(EXTENSION_NAME)-$(VERSION).zip

.PHONY: firefox
firefox:
	@echo "Packaging $(EXTENSION_NAME)-$(VERSION).xpi for Firefox..."
	@zip -r $(EXTENSION_NAME)-$(VERSION).xpi $(COMMON_FILES) manifest-firefox.json
	@printf "@ manifest-firefox.json\n@=manifest.json\n" | zipnote -w $(EXTENSION_NAME)-$(VERSION).xpi

.PHONY: clean
clean:
	@rm -f $(EXTENSION_NAME)-*.xpi $(EXTENSION_NAME)-*.zip
