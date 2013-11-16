HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!
The documentation is available in these locations:

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


Once those are installed, proceed to <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#installing-html5-reference-storefront-sources">Install HTML5 Reference Storefront Sources</a> and then run it either
<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#running-html5-reference-storefront-locally"><b>locally</b></a> or <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/README.md#running-html5-reference-storefront-remotely"><b>remotely</b></a>.

**NOTE:** Due to <a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing">CORS</a>, you must set up a proxy to handle the requests between Cortex API and HTML5 Storefront.
We use Apache HTTP Server 2.4 in the instructions below. For convenience/reference, we provide pre-configured Apache config files you can copy over to your local Apache deployment.
Any proxy works, but Apache HTTP Server is the only server we test.

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


* <a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port `9080`
* <a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a> Port `8080`
* <a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/extlink.png"></a>


<b>To run locally:</b>
<ul>
<li><b>Install and configure Apache 2.4 HTTP Server</b>
<ol>
<li>Download Apache 2.4 zip from (http://www.apachelounge.com/download/)</li>
<li>Extract the Apache24 folder locally to `C:\Apache24`</li>
<li>Copy over the reference configuration files (<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a> and <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>) to <code>C:\Apache24\conf</code><br/>
<b>NOTE:</b> The configurations files are set to run on your local, so no extra setup is required here.</li>
<li>Run the proxy: open a command line, navigate to <code>C:\Apache24\bin</code>, and run<br/>
<code>httpd.exe</code>
</li>
</ol>
</li>
<li><b>Configure HTML5 Reference Storefront for the Cortex mobee Store</b>
<ol>
<li>With a text editor, open <code>ui-storefront/public/ep.config.json</code>
<li>Change the cortexAPI JSON element to the following:<br/>
<pre>
"cortexApi":{
"path":"cortex",
"scope":"mobee"
},
</pre>
</li>
</ol>
</li>
<li><b>Start up the Node.js</b>
<ul>
<li>Open a command line, navigate to your HTML5 Storefront directory, and run<br/>
<code>node app</code>
</li>
</ul>
</li>
<li><b>Access HTML5 Reference Storefront</b>
<ul>
<li>Open your browser and navigate to<br/>
<code>localhost/html5storefront/</code>
</li>
</ul>
</li>
</ul>


<h3 id="remote">Running HTML5 Reference Storefront Remotely</h3>
Running remotely means your HTML5 Reference Storefront is running locally, but Cortex API, Search, Commerce Engine, etc, run on an external server.
When running remotely, we expect your Cortex API is using the Integrator project. For more information on the Integrator, see http://docs.elasticpath.com

<b>To run remotely:</b>
<ul>
<li><b>Install and configure Apache 2.4 HTTP Server</b>
<ol>
<li>Download Apache 2.4 zip from (http://www.apachelounge.com/download/)</li>
<li>Extract the Apache24 folder locally to `C:\Apache24`</li>
<li>Copy over the reference configuration files (<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a> and <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>) to <code>C:\Apache24\conf</code><br/>
</li>
<li>In <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a>,
comment out </li>
<li>Run the proxy: open a command line, navigate to <code>C:\Apache24\bin</code>, and run<br/>
<code>httpd.exe</code>
</li>
</ol>
</li>
<li><b>Start up the Node.js</b>
<ul>
<li>Open a command line, navigate to your HTML5 Storefront directory, and run<br/>
<code>node app</code>
</li>
</ul>
</li>
<li><b>Access HTML5 Reference Storefront</b>
<ul>
<li>Open your browser and navigate to<br/>
<code>localhost/html5storefront</code>
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
2. From cygwin command line, run <code>docco ui-storefront/documentation/*.litcoffee</code>

Files generate to: ui-storefront/docs

**Notes:**

- Use cygwin for the windows command line. Windows command line can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.