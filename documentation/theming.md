Theming
====================
Theming allows you to change the HTML5 Reference Storefront's look and feel without having to change the JavaScript.
Themes take advantage of <a href="http://lesscss.org/">{less}</a>, a powerful dynamic stylesheet language, chosen for its ease of use, dynamism, and widespread adoption.

Each theme is comprised of a set of individual <a href="http://lesscss.org/">{less}</a> files, which get compiled into single style.css that HTML5 Storefront uses.
{less} files are organized according to the view/region on HTML5 Storefront. See {less} Regions



Theme Directory Structure
-----------------
The image below shows the important files for the HTML5 Storefront's core theme.

![themeStructures](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/themeStructures.png)

Compiling your Theme
-----------------
To compile your {less} files:

* In a command line, navigate to the HTML5 Reference Storefront root, and run one of the following:
<table>
<tbody>
<tr align="center">
<th align="center" valign="middle">Command</th>
<th align="center" valign="middle">Definition</th>
</tr>
<tr>
<td><code>grunt less</code></td>
<td>Compiles the {less} files into style.css.</td>
</tr>
<tr>
<td><code>grunt watch</code></td>
<td>Sets Grunt to watch the {less} files for changes and immediately compiles the style.css when a change is detected.</td>
</tr>
</tbody>
</table>
By default, the {less} files compile to <code>ui-storefront/public/style/style.css</code>
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

{less} Regions
---------------------
Each of the {less} files each represent a view/region on the Storefront. A view is.....



<h2>Tutorial: Writing Your Own Theme</h2>

* Overview of how to do this:
Recommend copy existing theme
Wire it in
Modify it using the regions as a guide.

