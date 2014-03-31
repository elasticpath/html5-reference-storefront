Theming
====================
Theming allows you to change the HTML5 Reference Storefront's look and feel without having to modify the JavaScript.
Themes take advantage of <a href="http://lesscss.org/">{less}</a>, a powerful dynamic stylesheet language, chosen for its ease of use, dynamism, and widespread adoption.

Each theme is a set of individual <a href="http://lesscss.org/">{less}</a> files, which, on demand, are compiled into a single <code>style.css</code>.
The core theme's {less} files are organized according to the views, which are output representations of the HTML5 Storefront's features.
For example, <code>cart.less</code> contains the CSS for the cart's view, <code>itemdetail.less</code> contains the CSS for the item's view, and so on.

By modifying the {less} files you can change the HTML5 Storefront’s look and feel and create your own themes.


Theme Directory Structure
-----------------
The image below shows HTML5 Storefront's core theme files.

![themeStructures](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/themeStructures.png)

Compiling Themes
-----------------
<code>ui-storefront\Gruntfile.js</code> defines how and where your theme's {less} files compile.

<b>To compile your {less} files:</b>

* In a command line, navigate to the HTML5 Reference Storefront root, and run one of the following:
<table>
<tbody>
<tr align="center">
<th align="center" valign="middle">Command</th>
<th align="center" valign="middle">Definition</th>
</tr>
<tr>
<td><code>grunt less</code></td>
<td>Compiles {less} files into style.css.</td>
</tr>
<tr>
<td><code>grunt watch</code></td>
<td>Sets Grunt to watch {less} files for changes and immediately compiles the style.css when a change is detected.</td>
</tr>
</tbody>
</table>
By default, {less} files compile to <code>ui-storefront/public/style/style.css</code>
<br/>

<b>TROUBLESHOOTING NOTE:</b> Grunt {less} compilation issues: <i>throw new TypeError('Arguments to path.resolve must be strings');</i>
This may be related to a version conflict. <br/>
<ul>
<li>
Try cleaning and reinstalling grunt. In your command line, navigate to the HTML5 Storefront's root directory, and run the following<br/>
<pre>
npm uninstall -g grunt-cli
rm -rf node_modules
npm cache clean
npm install -g grunt-cli
npm install grunt
</pre>
</li>
<li>Alternatively, you may need to reinstall your HTML5 Reference Storefront. In your command line, navigate to the HTML5 Storefront's root directory, and run<br/>
<code>npm install</code>
</li>
</ul>

<h2>Tutorial: Creating a Theme</h2>
To develop your own theme, we recommend copying the core theme and then customizing it to suit your purposes.

<b>To create a theme based off the core theme:</b>

<ol>
<li>Copy the theme-core folder in <code>ui-storefront/stylesrc/theme-core</code></li>
<li>Rename the copied theme folder: <code>ui-storefront/stylesrc/<b>THEME_NAME</b></code></li>
<li>Update <code>ui-storefront/stylesrc/style.less</code> to reference the new theme:
<pre>
@import url("./<b>THEME_NAME</b>/<b>theme-base</b>.less");
</pre>
</li>
<li>Change <code>Gruntfile.js</code> to reference your {less} files in its builds:
<pre>
less: {
development: {
files: {
"public/style/style.css": "stylesrc/style.less"
}}},
watch: {
scripts:{
files: ['stylesrc/<b>THEME_NAME</b>/*.less'],
tasks: ['less']
}}
</pre>
<li>Code your CSS.</li>
<li>Compile and run the HTML5 Reference Storefront.</li>
</ol>


Keep in mind:


* Image paths are relative to <code>ui-storefront/public/style</code>
* <code>variables.less</code> - Controls the look and feel for some of the Storefront's common elements, such the colors and fonts for carts, items, links, and so on.
* <code>mixins.less</code> - Embeds other CSS properties into the Storefront's general CSS classes.
* Templates - Are described in <a href="https://github.elasticpath.net/cortex/ui-storefront/blob/master/documentation/extending.md">Customizing HTML5 Features</a>.


###### Legal Mumbo Jumbo
This document is confidential and proprietary information of Elastic Path Software Inc. Copyright © 2013 Elastic Path Software Inc. All rights reserved. Elastic Path®, the Elastic Path logo, EP Commerce Engine™, EP Cortex™, and EP Subscriptions™ are trademarks or registered trademarks of Elastic Path Software Inc. All other trademarks are the property of their respective owners.
