HTML5 Storefront Technology
====================
HTML5 Storefront technologies were chosen for their robustness, popularity, and extensibility.
The idea is that your JavaScript developers and front-end developers already know these technologies, so they can start extending and customizing your HTML5 Storefront as quickly as possible.

<h2 id="platformArchitecture">Platform Architecture</h2>
![codeStructure](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/architecture.png)

Technology Stack
---------------------
<table border="1" cellpadding="3" cellspacing="0" style="; width: 80%; border: 1px solid #000000">
<tbody>
<tr>
<th align="center" valign="middle">Technology</th>
<th align="center" valign="middle">Description</th>
<th align="center" valign="middle">Version</th>
</tr>
<tr>
<td><strong><a href="http://requirejs.org/">require.js</a></strong></td>
<td>JavaScript library facilitating asynchronous module definition <a href="http://en.wikipedia.org/wiki/Asynchronous_module_definition">(AMD)</a> .
</td>
<td>2.0</td>
</tr>
<tr>
<td><strong><a href="http://jquery.com/">jQuery</a></strong></td>
<td>Fast, feature rich JavaScript library used for the base DOM abstraction layer.</td>
<td>1.8</td>
</tr>
<tr>
<td><strong><a href="http://underscorejs.org/">underscore.js</a></strong></td>
<td>Lightweight JavaScript utility and template framework</td>
<td>1.4.4</td>
</tr>
<tr>
<td><strong><a href="http://backbonejs.org/">backbone.js</a></strong></td>
<td>
<p>Foundation UI framework. Provides the core UI elements such as Models, Views, and Events.
dependencies.</p>
</td>
<td>1.0.0</td>
</tr>
<td><strong><a href="http://nodejs.org/">node.js</a></strong></td>
<td>Simple, lightweight web server implementation, acting as a proxy server to facilitate <em>cross-domain</em> communication with the Cortex API.
<td>0.8.x</td>
</tr>
<tr>
<td><strong><a href="http://gruntjs.com/">grunt.js</a></strong></td>
<td>
<p>Build and configuration tool.<em>Dependencies</em>: <em><strong>nodejs 1.8.x</strong></em></p>
</td>
<td>0.4.x</td>
</tr>
<tr>
<td><strong><a href="http://lesscss.org/">{less}</a></strong></td>
<td>
<p>Extends CSS with dynamic behavior, utilizing variables, mixins, operations, and functions.</p>
</td>
<td>1.3.3</td>
</tr>
</tbody>
</table>

Testing Frameworks
---------------------
<table border="1" cellpadding="3" cellspacing="0" style="; width: 80%; border: 1px solid #000000">
<tbody>
<tr>
<th align="center" valign="middle">Technology</th>
<th align="center" valign="middle">Description</th>
<th align="center" valign="middle">Version</th>
</tr>
<tr>
<td><strong>Mocha</strong></td>
<td>JavaScript test framework running on node.js.</td>
<td>1.10.0</td>
</tr>
<tr>
<td><strong>Chai</strong></td>
<td>Assertion library for node.js.</td>
<td>1.6.1</td>
</tr>
<tr>
<td><strong>Selenium</strong></td>
<td>Automated testing of the browser components.</td>
<td>2.35.0</td>
</tr>
</tbody>
</table>

HTML5 Code Structure
---------------------
![codeStructure](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/fileStructure.png)

Platform Support
---------------------
<table>
<tbody>
<tr align="center">
<th align="center" valign="middle"></th>
<th align="center" valign="middle">Certified*</th>
<th align="center" valign="middle">Compatible*</th>
<th align="center" valign="middle">Not Supported</th>
</tr>
<tr>
<td ><strong>Browsers</strong></td>
<td>

* IE 10+
* Chrome
* Safari

</td>
<td>

* Firefox

</td>
<td></td>
</tr>
<tr>
<td><strong>Devices</strong></td>
<td>

* Android tablets 10" & 7"
* iOS tablest 10" & 7"

</td>
<td>

* Android Phones
* iOS Phones

</td>
<td>

* Windows Tablets
* Windows Phones

</td>
</tr>
</tbody>
</table>
**Certified* - Officially Supported and Tested

**Compatible* - Base functionality works - Not tested.