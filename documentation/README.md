Generate the documentation using DOCCO (http://jashkenas.github.io/docco/).

To generate the documentation:

1. Install DOCCO: npm install -g docco
2. From cygwin command prompt, run "docco ui-storefront/documentation/*.md"

Files generate to: ui-storefront/docs


Notes
----
- Use cygwin for the windows command prompt. Windows command prompt can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.
