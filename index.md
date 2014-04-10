---
layout: master
permalink: /
title: Home
weight: 1
---

Welcome to Elastic Path's HTML5 Reference Storefront!
We have the following docs:

* [Introduction]({{ site.baseurl }}/documentation/introduction/)   
HTML5 Storefront introduction, overview of the Storefront's customization layers, Cortex API introduction, HTML5 Reference Storefront feature list, and documentation notes.
* [HTML5 Storefront Technology]({{ site.baseurl }}/documentation/technologyoverview/)   
Platform architecture, technology stack, testing frameworks, project code structure, platform support.
* [Extending HTML5 Storefront Features]({{ site.baseurl }}/documentation/extending/)   
Overview of HTML5 Storefront's MVC framework, synopsis of the Storefront's extension model, and a tutorial that teaches how to create an extension to Items.
* [Theming]({{ site.baseurl }}/documentation/theming/)   
Introduction to HTML5 Storefront presentation layer, theme basics, and a tutorial on creating a theme.
* [Testing]()  - *Coming soon*   
Introduction to HTML5 Storefront testing framework, overview of unit testing, and steps on how to add a new test to the testing framework.
* [How Tos]({{ site.baseurl }}/documentation/howTOs/)   
Describes how to code your JavaScript for some of the more advanced Cortex API features: selectors, forms, searches, authentication, and so on.

Installing and Running
====================
The HTML5 Reference Storefront requires the following installed:

<ul>
<li><a href="http://git-scm.com/downloads" target="_blank">GIT Client <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
<li><a href="http://nodejs.org/" target="_blank">Node.js <img src="{{ site.baseurl }}/documentation/img/extlink.png" /></a></li>
</ul>

Once those are installed, proceed to [Install HTML5 Reference Storefront Sources](#installing-html5-reference-storefront-sources) and then run the Storefront either
**[locally](#running-html5-reference-storefront-locally)** or **[remotely](#running-html5-reference-storefront-remotely)**.

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

* **Set the Cortex end-point configuration to point to your local Cortex instance**

  * Open `ui-storefront/Gruntfile.js` and change the `CORTEX_HOST`, `CORTEX_PORT` variables as follows:

        var CORTEX_HOST = 'localhost';
        var CORTEX_PORT = '9080';

* **Start the app**

  * Open a command line, navigate to your HTML5 Storefront directory, and run
    `grunt start`

* **Access HTML5 Reference Storefront**

  * Open your browser and navigate to   
    `localhost:3007/html5storefront/`

### <a name="running-html5-reference-storefront-remotely"> </a>Running HTML5 Reference Storefront Remotely
Running remotely means your HTML5 Reference Storefront runs locally on port `3008`, but Cortex API, Search, Commerce Engine, etc, run on an external server.
When running remotely, we expect your Cortex API is using Elastic Path Integrator, see [http://docs.elasticpath.com](http://docs.elasticpath.com) for more information on Integrator.

![localSetup]({{ site.baseurl }}/documentation/img/remote_proxy_setup.png)

**To run remotely:**

* **Set the Cortex end-point configuration to point to a remote Cortex instance**

  * Open `ui-storefront/Gruntfile.js` and change the `CORTEX_HOST`, `CORTEX_PORT` variables as follows:

          var CORTEX_HOST = '54.213.124.208';
          var CORTEX_PORT = '8080';

  * **Start the app**

    * Open a command line, navigate to your HTML5 Storefront directory, and run   
    `grunt start`

  * **Access HTML5 Reference Storefront**

    * Open your browser and navigate to   
    `localhost:3007/html5storefront/`

{% include legal.html %}