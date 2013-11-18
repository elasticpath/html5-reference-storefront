Theming
====================
Theming allows you to change the HTML5 Reference Storefront's look and feel without having to modify the JavaScript.
Themes take advantage of <a href="http://lesscss.org/">{less}</a>, a powerful dynamic stylesheet language, chosen for its ease of use, dynamism, and widespread adoption.

Each theme is a set of individual <a href="http://lesscss.org/">{less}</a> files, which are compile into single <code>style.css</code> that the HTML5 Storefront uses.
The core theme's {less} files are organized according to the view.
For example, <code>cart.less</code> contains the CSS for the cart's look and feel, <code>itemdetail.less</code> contains the CSS for the item's look and feel, and so on.



Theme Directory Structure
-----------------
The image below shows the important HTML5 Storefront's core theme files.

![themeStructures](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/themeStructures.png)

Compiling your Theme
-----------------
How and where your theme's {less} files compile is defined in <code>Gruntfile.js</code>.

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

<h2>Templates</h2>
Templates are: HTML
Located in each module.
Follow Marrionette. _underscore


<h2>Tutorial: Creating a Theme</h2>
To develop your own theme, we recommend copying the core theme and then customizing it to suit your purposes.

<b>To create a theme based off the core theme:</b>

<ol>
<li>Copy the theme-core foder in <code>ui-storefront/stylesrc/theme-core</code></li>
<li>Rename folder</li>
<li>Change the theme's reference in <code>ui-storefront/stylesrc/style.less</code>
<pre>

</pre>
</li>
<li>Change the <code>Grunt.js</code> to point to the less files:
<pre>
less: {
development: {
//        options: {
//          paths: ["stylesrc"]
//        },
files: {
"public/style/style.css": "stylesrc/style.less"
}
}
},
watch: {
scripts:{
files: ['stylesrc/theme-core/*.less'],
tasks: ['less']
}
}
</pre>
</li>
<li>Code your CSS</li>
<li>Compile and run</li>
</ol>

Keep in mind: the less variable files -> some of the