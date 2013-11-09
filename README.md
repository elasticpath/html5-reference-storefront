HTML5 Reference Storefront
=============


Installing
====================
This document assumes you are setting up and installing the HTML5 Reference Storefront locally.
Before you begin, you need the following running locally

* The Cortex API
* Commerce Engine
* Search Server

-Installing HTML5 (locally) Cortex + DCE expected be running locally
- search

Fetch the HTML5 Reference Store from git


Documentation
=============
Generate the documentation using DOCCO (http://jashkenas.github.io/docco/).

To generate the documentation:

1. Install DOCCO: npm install -g docco
2. From cygwin command prompt, run "docco ui-storefront/documentation/*.litcoffee"

Files generate to: ui-storefront/docs


Notes
----
- Use cygwin for the windows command prompt. Windows command prompt can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.