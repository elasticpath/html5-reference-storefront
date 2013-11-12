HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!

The HTML5 Storefront is an flexible e-commerce website backed by Elastic Path's Cortex API.
The HTML5 Storefront, comprised of the latest technologies (JavaScript, HTML5, jQuery, CSS3, {less}, Marionette, Node.js, etc.), is designed for extensibility.

E-commerce functionality (cart, authentication, profile, search, etc.) is separated from the website's presentation, allowing
front-end developers to work on the CSS without having to touch the JavaScript, while JavaScript developers can develop
functionality without having to touch the front end. Each customization layer is separated from the HTML5's core code, so
neither developer has to touch the Storefront's engine. For more information on the customization layers, see <a href="documentation/introduction.md">Introduction</a>.


Installing
====================
Before you begin, the following must be already installed and running locally:

* Cortex API (https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide)
* Commerce Engine (https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide)
* Search Server (https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide)
* GIT Client (http://git-scm.com/downloads)
* Node.js (http://nodejs.org/)

To install and run HTML5 Reference Storefront:
<ol>
<li>Fetch the HTML5 Reference Store sources </br>
<code>git clone https://github.com/dotcloud/docker.git</code>
</li>
<li>Using your command prompt, navigate to the HTML5 Reference Storefront directory</li>
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