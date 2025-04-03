name := "clipper"
version := `git describe --tags --abbrev=10 --always --dirty | sed 's/^v//'`
common_files := "src/* assets/*"
dist := "dist"

default:
  @just --list

build: chrome firefox
  @(cd "{{dist}}" && sha256sum * > sha256sum.txt)

chrome:
  @mkdir -p {{dist}}
  @echo "Packaging {{name}}-{{version}}.zip for Chrome..."
  @zip -r {{dist}}/{{name}}-{{version}}.zip {{common_files}} manifest-chrome.json
  @printf "@ manifest-chrome.json\n@=manifest.json\n" | zipnote -w {{dist}}/{{name}}-{{version}}.zip

firefox:
  @mkdir -p {{dist}}
  @echo "Packaging {{name}}-{{version}}.xpi for Firefox..."
  @zip -r {{dist}}/{{name}}-{{version}}.xpi {{common_files}} manifest-firefox.json
  @printf "@ manifest-firefox.json\n@=manifest.json\n" | zipnote -w {{dist}}/{{name}}-{{version}}.xpi

clean:
  @rm -rf {{dist}}