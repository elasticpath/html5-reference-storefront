HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!
The documentation is available in the following locations:

* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/introduction.md">Introduction</a> ->
* HTML5 Storefront Technology ->
* Extending HTML5 Storefront Features ->
* Theming ->
* Testing ->
* How Tos ->


Installing
====================
Before you begin, the following must be already installed and running locally:

* <a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API</a>
* Commerce Engine (https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide)
* Search Server (https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide)
* GIT Client (http://git-scm.com/downloads)
* Node.js (http://nodejs.org/)

To install and run HTML5 Reference Storefront:
<ol>
<li>Fetch the HTML5 Reference Store sources </br>
<code>https://github.elasticpath.net/cortex/ui-storefront</code>
</li>
<li>Using your command prompt, navigate to the HTML5 Reference Storefront directory and run the following command:</br>
<code>npm install</code>
</li>
<li></li>
</ol>



Documentation
=============
Generate the documentation using DOCCO (http://jashkenas.github.io/docco/).

To generate the documentation:

1. Install DOCCO: npm install -g docco
2. From cygwin command prompt, run "docco ui-storefront/documentation/*.litcoffee"

Files generate to: ui-storefront/docs

**Notes:**

- Use cygwin for the windows command prompt. Windows command prompt can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.