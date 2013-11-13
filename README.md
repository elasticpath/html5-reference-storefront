HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!
The documentation is available in these locations:

* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/introduction.md">Introduction</a> - </br>
HTML5 Storefront introduction, overview of the Storefront's customization layers, Cortex API introduction, HTML5 Reference Storefront feature list, and documentation notes.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/technologyoverview.md">HTML5 Storefront Technology</a> - </br>
Platform architecture, technology stack, testing frameworks, project code structure, platform support.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/extending.md">Extending HTML5 Storefront Features</a> - </br>
Overview of HTML5 Storefront's MVC framework, snopsis of the Storefront's extension model, and a tutorial that teaches how to create an extension to Items.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/theming.md">Theming</a> - </br>
Introduction to HTML5 Storefront presentation layer, basics of Storefront themes, and a tutorial on creating a theme.
* <a href="">Testing</a> - </br>
Introduction to HTML5 Storefront testing framework, overview of unit testing, and steps on how to add a new test to the testing framework.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/howTOs.md">How Tos</a> - </br>
Describes how to code your JavaScript for some of the more advanced Cortex API features: selectors, forms, searches, authentication, and so on.


Installing and Running
====================
Before you begin, the following must already be installed and running locally:

* <a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port `9080`
* <a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port `8080`
* <a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a>
* <a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"> </a>
* <a href="http://nodejs.org/" target="_blank">Node.js <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a>

</br>

**Installing HTML5 Reference Storefront:**</br>
<ol>
<li>Fetch HTML5 Reference Storefront sources </br>
<code>https://github.elasticpath.net/cortex/ui-storefront</code>
</li>
<li>Using your command prompt, navigate to HTML5 Reference Storefront directory and run the following command to install the Storefront's required dependencies:</br>
<code>npm install</code>
</li>
</ol>

</br>
**Running HTML5 Reference Storefront:**</br>
Due to CORS, you need to install Apache Proxy.
<ol>
<li>Set up an Apache Proxy: </br>
<li>Download Apache 2.4 zip file from (http://www.apachelounge.com/download/)</li>
<li>Extract the Apache24 folder locally to C:\Apache24</li>
</ol>
</li>
</ol>



Documentation
=============
The documentation is available online through GITHUB: https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md

Alternatively, you can generate the documentation locally using DOCCO (http://jashkenas.github.io/docco/).

To generate the documentation locally:

1. Install DOCCO: npm install -g docco
2. From cygwin command prompt, run "docco ui-storefront/documentation/*.litcoffee"

Files generate to: ui-storefront/docs

**Notes:**

- Use cygwin for the windows command prompt. Windows command prompt can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.