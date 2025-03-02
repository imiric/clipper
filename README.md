<p align="center">
  <img width="256" height="256" src="/images/icon.svg">
</p>

# Org Clipper

Org Clipper is a web browser extension for Chrome and Firefox that copies the page
title and URL of the current tab in [Org format](https://orgmode.org/).

The contents of the clipboard will be something like:

```Org
*** Example title
:PROPERTIES:
:url: https://example.com/
:END:
```

This can then be pasted in an Org document.


## Install

Download the .xpi (for Firefox) or .zip (for Chrome) file from the
[releases page](https://github.com/imiric/org-clipper/releases) and manually add the
extension via your browser's settings.

> [!NOTE]
> These files aren't signed, and the author has no intention of distributing the
> extension via the Chrome or Firefox stores. If you distrust these packages,
> see below for manual build instructions.

On Chrome, drag and drop the .zip file on the extensions page.

On Firefox, you will need to set `xpinstall.signatures.required` to `false` on the
`about:config` page. Then click on the cog wheel on the "Manage Your Extensions"
page, and "Install Add-on From File...".

Alternatively, if you prefer to build the packages yourself, clone the Git repository
and run `make`. Then manually add the built packages to your browser.

In Chrome, you could also load the extension directory without building the extension
via the "Load unpacked" option. This is useful during development.


## Usage

Click on the extension icon in the toolbar or use the Alt+o keyboard shortcut.

On the extension options page you can modify the preferred headline level. The
default is 3.


## License

[MIT](/LICENSE)
