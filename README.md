HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!
We have the following docs:

* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/introduction.md">Introduction</a> <br/>
HTML5 Storefront introduction, overview of the Storefront's customization layers, Cortex API introduction, HTML5 Reference Storefront feature list, and documentation notes.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/technologyoverview.md">HTML5 Storefront Technology</a>  <br/>
Platform architecture, technology stack, testing frameworks, project code structure, platform support.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/extending.md">Extending HTML5 Storefront Features</a> <br/>
Overview of HTML5 Storefront's MVC framework, synopsis of the Storefront's extension model, and a tutorial that teaches how to create an extension to Items.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/theming.md">Theming</a>  <br/>
Introduction to HTML5 Storefront presentation layer, theme basics, and a tutorial on creating a theme.
* <a href="">Testing</a>  <br/>
Introduction to HTML5 Storefront testing framework, overview of unit testing, and steps on how to add a new test to the testing framework.
* <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/howTOs.md">How Tos</a>  <br/>
Describes how to code your JavaScript for some of the more advanced Cortex API features: selectors, forms, searches, authentication, and so on.


Installing and Running
====================
The HTML5 Reference Storefront requires the following installed:

* <a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a>
* <a href="http://nodejs.org/" target="_blank">Node.js <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a>

Once those are installed, proceed to <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#installing-html5-reference-storefront-sources">Install HTML5 Reference Storefront Sources</a> and then run the Storefront either
<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#running-html5-reference-storefront-locally"><b>locally</b></a> or <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#running-html5-reference-storefront-remotely"><b>remotely</b></a>.

<h3>Installing HTML5 Reference Storefront Sources</h3>
<ol>
<li>Fetch HTML5 Reference Storefront sources: <br/>

<code>https://github.elasticpath.net/cortex/ui-storefront</code>
</li>
<li>Install the Storefront's dependencies by navigating to HTML5 Reference Storefront directory and running:<br/>
<code>npm install</code>
</li>
</ol>

<h3 id="local">Running HTML5 Reference Storefront Locally</h3>
Running locally means all your applications, Cortex API, Search, HTML5 Storefront, etc, are running on your local computer on these ports:

<ul>
<li><a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port <code>9080</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port <code>8080</code></li>
<li><a href="http://nodejs.org/" target="_blank">node.js <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port <code>3008</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a></li>
</ul>

![localSetup](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/local_proxy_setup.png)

<b>To run locally:</b>
<ul>
<li><b>Set the Cortex end-point configuration to point to your local Cortex instance</b>
<ul>
<li>Open <code>ui-storefront/Gruntfile.js</code> and change the <code>CORTEX_HOST</code>, <code>CORTEX_PORT</code> variables as follows:<br/>
<pre>
var CORTEX_HOST = 'localhost';
var CORTEX_PORT = '9080';
</pre>
</li>
</ul>
</li>
<li><b>Start the app</b>
<ul>
<li>Open a command line, navigate to your HTML5 Storefront directory, and run<br/>
<code>grunt start</code>
</li>
</ul>
</li>
<li><b>Access HTML5 Reference Storefront</b>
<ul>
<li>Open your browser and navigate to<br/>
<code>localhost:3007/html5storefront/</code>
</li>
</ul>
</li>
</ul>


<h3 id="remote">Running HTML5 Reference Storefront Remotely</h3>
Running remotely means your HTML5 Reference Storefront runs locally on port <code>3008</code>, but Cortex API, Search, Commerce Engine, etc, run on an external server.

![localSetup](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/remote_proxy_setup.png)

<b>To run remotely:</b>
<ul>
<li><b>Set the Cortex end-point configuration to point to a remote Cortex instance</b>
<ul>
<li>Open <code>ui-storefront/Gruntfile.js</code> and change the <code>CORTEX_HOST</code>, <code>CORTEX_PORT</code> variables as follows:<br/>
<pre>
var CORTEX_HOST = '54.213.124.208';
var CORTEX_PORT = '8080';
</pre>
</li>
</ul>
</li>
<li><b>Start the app</b>
<ul>
<li>Open a command line, navigate to your HTML5 Storefront directory, and run<br/>
<code>grunt start</code>
</li>
</ul>
</li>
<li><b>Access HTML5 Reference Storefront</b>
<ul>
<li>Open your browser and navigate to<br/>
<code>localhost:3007/html5storefront/</code>
</li>
</ul>
</li>
</ul>


Documentation
=============
The documentation is available online through GitHub: https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md

Alternatively, you can generate the documentation locally using DOCCO (http://jashkenas.github.io/docco/).

To generate the documentation locally:

1. Install DOCCO: <code>npm install -g docco</code>
2. From cygwin command line, run <code>docco ui-storefront/documentation/*.md -l linear</code>

Files generate to: ui-storefront/docs

**Notes:**

- Use cygwin for the windows command line. Windows command line can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.
- Links (images + hrefs)are hardcoded to GitHub. To generate locally, change the image references so they are local.


###### Legal Mumbo Jumbo
This document is confidential and proprietary information of Elastic Path Software Inc. Copyright © 2013 Elastic Path Software Inc. All rights reserved. Elastic Path®, the Elastic Path logo, EP Commerce Engine™, EP Cortex™, and EP Subscriptions™ are trademarks or registered trademarks of Elastic Path Software Inc. All other trademarks are the property of their respective owners.
