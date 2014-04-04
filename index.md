---
layout: master
---
 HTML5 Reference Storefront
=============
Welcome to the Elastic Path's HTML5 Reference Storefront!
We have the following docs:

* [Introduction]({{ site.baseurl }}/documentation/introduction/)   
HTML5 Storefront introduction, overview of the Storefront's customization layers, Cortex API introduction, HTML5 Reference Storefront feature list, and documentation notes.
* [HTML5 Storefront Technology]({{ site.baseurl }}/documentation/technologyoverview/)   
Platform architecture, technology stack, testing frameworks, project code structure, platform support.
* [Extending HTML5 Storefront Features]({{ site.baseurl }}/documentation/extending/)   
Overview of HTML5 Storefront's MVC framework, synopsis of the Storefront's extension model, and a tutorial that teaches how to create an extension to Items.
* [Theming]({{ site.baseurl }}/documentation/theming/)   
Introduction to HTML5 Storefront presentation layer, theme basics, and a tutorial on creating a theme.
* [Testing]()   
Introduction to HTML5 Storefront testing framework, overview of unit testing, and steps on how to add a new test to the testing framework.
* [How Tos]({{ site.baseurl }}/documentation/howTOs/)   
Describes how to code your JavaScript for some of the more advanced Cortex API features: selectors, forms, searches, authentication, and so on.

Installing and Running
====================
The HTML5 Reference Storefront requires the following installed:

* <a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a>
* <a href="http://nodejs.org/" target="_blank">Node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a>

Once those are installed, proceed to [Install HTML5 Reference Storefront Sources](#installing-html5-reference-storefront-sources) and then run the Storefront either
**[locally](#running-html5-reference-storefront-locally)** or **[remotely](#running-html5-reference-storefront-remotely)**.

**NOTE: <a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing">CORS</a>** Due to CORS, you must set up a proxy to handle the requests between Cortex API and HTML5 Storefront.
We use Apache HTTP Server 2.4 in the instructions below. For reference, we provide pre-configured Apache config files you can copy over to your local Apache deployment.
Any proxy works, but Apache HTTP Server is the only server we test.


**NOTE: Port 80 Conflicts** Often on Windows 7, `port 80` is in use by a system service. To have Apache listen on another port, like `port 81`, change the following:

* Apache <a href="documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>   
`Listen 81`   
* Apache <a href="documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a>   
`RequestHeader append X-Forwarded-Base "http://localhost:81/cortex"`
* For HTML5 Storefront Selenium Tests, update `server.port` in <a href="https://github.elasticpath.net/cortex/selenium/blob/master/testng-ui/pom.xml"><code>repository/selenium/testng-ui/pom.xml</code></a>:

        <properties>   
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <server.port>81</server.port>
          <selenium.session.baseurl.ui>http://localhost:${server.port}/html5storefront/</selenium.session.baseurl.ui>   
        </properties>

Now access Storefront through: `localhost:81/html5storefront`

### <a name="installing-html5-reference-storefront-sources"> </a> Installing HTML5 Reference Storefront Sources
1. Fetch HTML5 Reference Storefront sources:
`https://github.elasticpath.net/cortex/ui-storefront`
2. Install the Storefront's dependencies by navigating to HTML5 Reference Storefront directory and running:   
`npm install`

### <a name="running-html5-reference-storefront-locally"> </a>Running HTML5 Reference Storefront Locally
Running locally means all your applications, Cortex API, Search, HTML5 Storefront, etc, are running on your local computer on these ports:

<ul>
<li><a href="https://docs.elasticpath.com/display/EPCAPIDEV/Installation+and+Configuration+Guide" target="_blank">Cortex API <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>9080</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Search Server <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>8080</code></li>
<li><a href="http://nodejs.org/" target="_blank">node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a> Port <code>3008</code></li>
<li><a href="https://docs.elasticpath.com/display/EP680DEV/Installation+and+Configuration+Guide" target="_blank">Commerce Engine <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

![localSetup]({{ site.baseurl }}/documentation/img/local_proxy_setup.png)

**To run locally:**

* **Install and configure Apache 2.4 HTTP Server**   
  1. Download Apache 2.4 zip from [http://www.apachelounge.com/download/](http://www.apachelounge.com/download/)   
  2. Extract the Apache24 folder locally to `C:\Apache24`   
  3. Copy over the reference configuration files \[[ep-cortex-proxy.conf]({{ site.baseurl }}/documentation/apacheConfigs/ep-cortex-proxy.conf) and [httpd.conf]({{ site.baseurl }}/documentation/apacheConfigs/httpd.conf)\] to `C:\Apache24\conf`
**NOTE:** The configurations files are set to run on your local, so no extra setup should be required.   
  4. Run the proxy: open a command line, navigate to `C:\Apache24\bin`, and run   
`httpd.exe`
* **Configure HTML5 Reference Storefront for the Cortex mobee Store**   

  * Open `ui-storefront/public/ep.config.json` and change the cortexAPI JSON element to the following:   

        "cortexApi":{   
          "path":"cortex",   
          "scope":"mobee"   
        },

* **Start up Node.js**   

  * Open a command line, navigate to your HTML5 Storefront directory, and run   
    `node app`   

* **Access HTML5 Reference Storefront**

  * Open your browser and navigate to   
    `localhost/html5storefront/`

### <a name="running-html5-reference-storefront-remotely"> </a>Running HTML5 Reference Storefront Remotely
Running remotely means your HTML5 Reference Storefront runs locally on port `3008`, but Cortex API, Search, Commerce Engine, etc, run on an external server.
When running remotely, we expect your Cortex API is using Elastic Path Integrator, see [http://docs.elasticpath.com](http://docs.elasticpath.com) for more information on Integrator.

![localSetup]({{ site.baseurl }}/documentation/img/remote_proxy_setup.png)

**To run remotely:**

* **Install and configure Apache 2.4 HTTP Server**
  1. Download Apache 2.4 zip from [http://www.apachelounge.com/download/](http://www.apachelounge.com/download/)
  2. Extract the Apache24 folder locally to `C:\Apache24`
  3. Copy over the reference configuration files \[<a href="{{ site.baseurl }}/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a> and <a href="{{ site.baseurl }}/documentation/apacheConfigs/httpd.conf"><code>httpd.conf</code></a>\] to `C:\Apache24\conf`  
  4. In <a href="{{ site.baseurl }}/documentation/apacheConfigs/ep-cortex-proxy.conf"><code>ep-cortex-proxy.conf</code></a>,
comment out LOCAL SETUP and uncomment REMOTE SETUP.
  5. In REMOTE SETUP, set the web address and port for Integrator. For example, if Integrator ran at `http://aws-qa3.elasticpath.net:13080/integrator`
       
          #################REMOTE SETUP#################   
          RequestHeader append X-Forwarded-Base "http://localhost/integrator"

          ProxyPass /integrator http://aws-qa3.elasticpath.net:13080/integrator
          ProxyPassReverse /integrator http://aws-qa3.elasticpath.net:13080/integrator

          ProxyPass /html5storefront http://localhost:3008
          ProxyPassReverse /html5storefront http://localhost:3008

          #################REMOTE SETUP#################   

    **NOTE:** Ignore Studio setting if not using Studio.   
  6. Run the proxy: open a command line, navigate to `C:\Apache24\bin`, and run   
    `httpd.exe`
* **Configure HTML5 Reference Storefront for the Cortex telcooperative Store**

  * Open `ui-storefront/public/ep.config.json` and change the cortexAPI JSON element to the following:

          "cortexApi":{
            "path":"integrator",
            "scope":"telcooperative"
          },    

  * **Configure your Remote Server's Firewall and Proxy**

    * Configure your Remote Server's firewall and proxy to allow requests to/from your local Apache proxy.

  * **Start up Node.js**

    * Open a command line, navigate to your HTML5 Storefront directory, and run   
    `node app`

  * **Access HTML5 Reference Storefront**

    * Open your browser and navigate to   
    `localhost/html5storefront/`


###### Legal Mumbo Jumbo
This document is confidential and proprietary information of Elastic Path Software Inc. Copyright © 2013 Elastic Path Software Inc. All rights reserved. Elastic Path®, the Elastic Path logo, EP Commerce Engine™, EP Cortex™, and EP Subscriptions™ are trademarks or registered trademarks of Elastic Path Software Inc. All other trademarks are the property of their respective owners.