# Clipper <img width="64" height="64" src="/assets/icons/icon.svg">

Clipper is a web browser extension for Chrome and Firefox that allows copying page
information such as title and URL to the clipboard. The contents can be customized
via templates.


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

Alternatively, if you prefer to build the packages yourself, clone the Git
repository, install [Just](https://just.systems/man/en/). and run `just build`.
Then manually add the packages built in the `dist` directory to your browser.

In Chrome, you could also load the extension directory without building the extension
via the "Load unpacked" option. This is useful during development.


## Usage

Click on the extension icon in the toolbar or use the Alt+c keyboard shortcut to copy
information about the page in the current tab using the default template.

Clipper comes with three templates out-of-the-box:
- Markdown:
  ```md
  ### [$TITLE]($URL)
  
  
  ```

- Org Mode:
  ```org
  *** $TITLE
  :PROPERTIES:
  :url: $URL
  :END:
  
  
  ```

- Plain (default):
  ```
  Title: $TITLE
  URL: $URL
  
  ```

On the extension options page you can modify, add or delete templates:

![Options page](/assets/images/options.png)

You can change the default template by selecting it and pressing "Save". This can
also be changed via the context menu in the toolbar:

![Context menu](/assets/images/context_menu.png)

You can use variables `$TITLE` and `$URL` in templates to insert the page title and
URL respectively.


## License

[MIT](/LICENSE)
