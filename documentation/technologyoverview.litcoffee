HTML5 Storefront Technologies
====================
Describe our methodology/concept for using these technologies


Platform Architecture
---------------------
-pics and stuff go here!

Technology Stack
---------------------
<table border="1" cellpadding="3" cellspacing="0" style="; width: 100%; border: 1px solid #000000">
<tbody>
<tr>
<th align="center" valign="middle">Technology</th>
<th align="center" valign="middle">Description</th>
<th align="center" valign="middle">Version</th>
</tr>
<tr>
<td><strong><a href="http://requirejs.org/">require.js</a></strong></td>
<td>JavaScript library facilitating AMD (asynchronous module definition), allowing you to manage your
JavaScript dependencies within your application asynchronously. This allows you to write less boilerplate code and makes it easier to
encapsulate components in their own modules with the dependencies defined so there is less plumbing to worry about when
you change or add/remove modules from the app.</td>
<td>2.0</td>
</tr>
<tr>
<td><strong><a href="http://jquery.com/">jQuery</a></strong></td>
<td>Base DOM abstraction layer.</td>
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
<p>Foundation UI framework. Provides the core UI elements such as Models, Views, and Events.</p>
<p><em>dependencies</em>: <strong>jQuery</strong>, <strong>underscrore.js</strong></p>
</td>
<td>1.0.0</td>
</tr>
<td><strong><a href="http://nodejs.org/">node.js</a></strong></td>
<td>Simple and lightweight web server implementation. Can facitilitate some lightweight persistence but primary
role as a proxy server to facilitate <em>cross-domain</em> communication with the Cortex API. i.e. work around
the <em>same origin</em> issues with browsers</td>
<td>0.8.x</td>
</tr>
<tr>
<td><strong><a href="http://lesscss.org/">less css</a></strong></td>
<td>CSS pre-processor. JavaScript based CSS compiler allows for more flexible styling and theming via variables and
mixins</td>
<td>1.3.x</td>
</tr>
<tr>
<td><strong><a href="http://gruntjs.com/">grunt.js</a></strong></td>
<td>
<p>Build and configuration tool. Make it easier to concatenate, compress, gzip, application artifacts to improve performance.</p>
<p><em>dependencies</em>: <em><strong>nodejs 1.8.x</strong></em></p>
</td>
<td>0.4.x</td>
</tr>
</tbody>
</table>

Testing Frameworks
---------------------
<table border="1" cellpadding="3" cellspacing="0" style="; width: 100%; border: 1px solid #000000">
<tbody>
<tr>
<th align="center" valign="middle">Technology</th>
<th align="center" valign="middle">Description</th>
<th align="center" valign="middle">Version</th>
</tr>
<tr>
<td><strong>Mocha</strong></td>
<td></td>
<td></td>
</tr>
<tr>
<td><strong>Chai</strong></td>
<td></td>
<td></td>
</tr>
<tr>
<td><strong>Selenium</strong></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

HTML5 Code Structure
---------------------
![codeStructure](img/fileStructure.png)

Feature Guide
---------------------
- list of the OOTB features

Platform Support
---------------------
<table>
<caption align="center" valign="middle"><strong>Legend</strong></caption>
<tbody>
<tr>
<td align="center" valign="middle">![check](img/checkmark.png)</td>
<td align="center" valign="middle">Supported and Tested</td>
</tr>
<tr>
<td align="center" valign="middle">![check](img/unavailable.png)</td>
<td align="center" valign="middle">2</td>
</tr>
<tr>
<td align="center" valign="middle">![check](img/xmark.png)</td>
<td align="center" valign="middle">2</td>
</tr>
</tbody>
</table>
<table border="1">
<caption><strong>Desktop</strong></caption>
<tbody>
<tr>
<th align="center" valign="middle"><strong>OS</strong></th>
<th align="center" valign="middle"><strong>IE</strong></th>
<th align="center" valign="middle"><strong>Chrome</strong></th>
<th align="center" valign="middle"><strong>Firefox</strong></th>
<th align="center" valign="middle"><strong>Safari</strong></th>
</tr>
<tr>
<th><strong>Windows</strong></th>
<td align="center" valign="middle">![check](img/checkmark.png)</td>
<td align="center" valign="middle">![check](img/checkmark.png)</td>
<td align="center" valign="middle">![check](img/checkmark.png)</td>
</tr>
<tr>
<th><strong>Macintosh</strong></th>
<td>asdfsdf</td>
</tr>
<tr>
<th><strong>Linux</strong></th>
<td>asdfsdf</td>
</tr>
</tbody>
</table>

