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

**NOTE: <a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing">CORS</a>** Due to CORS, you must set up a proxy to handle the requests between Cortex API and HTML5 Storefront.
We use Apache HTTP Server 2.4 in the instructions below. For reference, we provide pre-configured Apache config files you can copy over to your local Apache deployment.
Any proxy works, but Apache HTTP Server is the only server we test.

**NOTE: Port 80 Conflicts** Often on Windows 7, <code>port 80</code> is in use by a system service. To have Apache listen on another port, like <code>port 81</code>, change the following:
<ul>
<li>Apache <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a><br/>
<code>Listen 81</code>
</li>
<li>Apache <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a><br/>
<code>RequestHeader append X-Forwarded-Base "http://localhost:81/cortex"</code></li>
<li>For HTML5 Storefront Selenium Tests, update <code>server.port</code> in <code><a href="https://github.elasticpath.net/cortex/selenium/blob/master/testng-ui/pom.xml">repository/selenium/testng-ui/pom.xml</a></code>:<br/>
<pre>
&lt;properties&gt;
	&lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
	&lt;server.port&gt;81&lt;/server.port&gt;
	&lt;selenium.session.baseurl.ui&gt;http://localhost:${server.port}/html5storefront/&lt;/selenium.session.baseurl.ui&gt;
&lt;/properties&gt;
</pre>
</li>
</ul>
Now access Storefront through: <code>localhost:81/html5storefront</code>


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
<li><b>Install and configure Apache 2.4 HTTP Server</b>
<ol>
<li>Download Apache 2.4 zip from (http://www.apachelounge.com/download/)</li>
<li>Extract the Apache24 folder locally to <code>C:\Apache24</code></li>
<li>Copy over the reference configuration files [<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a> and <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>] to <code>C:\Apache24\conf</code><br/>
<b>NOTE:</b> The configurations files are set to run on your local, so no extra setup should be required.</li>
<li>Run the proxy: open a command line, navigate to <code>C:\Apache24\bin</code>, and run<br/>
<code>httpd.exe</code>
</li>
</ol>
</li>
<li><b>Configure HTML5 Reference Storefront for the Cortex mobee Store</b>
<ul>
<li>Open <code>ui-storefront/public/ep.config.json</code> and change the cortexAPI JSON element to the following:<br/>
<pre>
"cortexApi":{
"path":"cortex",
"scope":"mobee"
},
</pre>
</li>
</ul>
</li>
<li><b>Start up Node.js</b>
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
Running remotely means your HTML5 Reference Storefront runs locally on port <code>3008</code>, but Cortex API, Search, Commerce Engine, etc, run on an external server.
When running remotely, we expect your Cortex API is using Elastic Path Integrator, see http://docs.elasticpath.com for more information on Integrator.

![localSetup](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/remote_proxy_setup.png)

<b>To run remotely:</b>
<ul>
<li><b>Install and configure Apache 2.4 HTTP Server</b>
<ol>
<li>Download Apache 2.4 zip from (http://www.apachelounge.com/download/)</li>
<li>Extract the Apache24 folder locally to <code>C:\Apache24</code></li>
<li>Copy over the reference configuration files [<a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a> and <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>] to <code>C:\Apache24\conf</code><br/>
</li>
<li>In <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a>,
comment out LOCAL SETUP and uncomment REMOTE SETUP.</li>
<li>In REMOTE SETUP, set the web address and port for Integrator. For example, if Integrator ran at <code>http://aws-qa3.elasticpath.net:13080/integrator</code><br/>
<pre>
#################REMOTE SETUP#################
RequestHeader append X-Forwarded-Base "http://localhost/integrator"

ProxyPass /integrator http://aws-qa3.elasticpath.net:13080/integrator
ProxyPassReverse /integrator http://aws-qa3.elasticpath.net:13080/integrator

ProxyPass /html5storefront http://localhost:3008
ProxyPassReverse /html5storefront http://localhost:3008

#################REMOTE SETUP#################
</pre>
<b>NOTE:</b> Ignore Studio setting if not using Studio.</li>
<li>Run the proxy: open a command line, navigate to <code>C:\Apache24\bin</code>, and run<br/>
<code>httpd.exe</code>
</li>
</ol>
</li>
<li>
<b>Configure HTML5 Reference Storefront for the Cortex telcooperative Store</b>
<ul>
<li>Open <code>ui-storefront/public/ep.config.json</code> and change the cortexAPI JSON element to the following:<br/>
<pre>
  "cortexApi":{
    "path":"integrator",
    "scope":"telcooperative"
  },
</pre>
</li>
</ul>
</li>
<li><b>Configure your Remote Server's Firewall and Proxy</b>
<ul>
<li>Configure your Remote Server's firewall and proxy to allow requests to/from your local Apache proxy.</li>
</ul>
</li>
</li>
<li><b>Start up Node.js</b>
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
2. From cygwin command line, run <code>docco ui-storefront/documentation/*.md -l linear</code>

Files generate to: ui-storefront/docs

**Notes:**

- Use cygwin for the windows command line. Windows command line can't handle the * character
- DOCCO does not copy the image files to the output folder. Copy over manually.
- Links (images + hrefs)are hardcoded to GitHub. To generate locally, change the image references so they are local.
