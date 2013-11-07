Introduction
====================
Welcome to the Elastic Path's HTML5 Storefront!

The HTML5 Storefront is an extensible e-commerce website backed by Elastic Path's Cortex API.
The Storefront is comprised of the latest technologies (JavaScript, HTML5, jQuery, CSS3, {less}, Marrionette, Node.js, etc)
 and is designed for extensibility.

E-commerce functionality (cart, authentication, profile, search, etc) is separated from the website's presentation, allowing
front-end developers to work on the CSS without having to touch the JavaScript, while JavaScript developers can develop
functionality without having to touch the front end. Each customization layer is separated from the HTML5's core code, so
neither developers have to touch the Storefront's engine.

###Customization Layers
The two customization layers of interest for JavaScript developers and front-end developers are the Module Layer and the Presentation Layer.
Take a look at the <a href="technologyoverview.html#platformArchitecture">Platform Architecture</a> to see where these two layers are positioned in regards to the rest of the system.

####Module Layer
This layer is where JavaScript developers build out/extend the HTML5 Storefront's functionality. Each module is an independent unit of code that does one thing.
Together, all the modules comprise the HTML5 Storefront's features. JS developers write and create these modules to enhance/create HTML5 Storefront functionality.

**What are HTML5 Storefront modules?**

Basically, an HTML5 Storefront module is the view, plus the code backing the view. For example, carts
For more information on extending/customizing modules, see <a href="extending.html">Customizing Storefront Features</a>

####Presentation Layer

Themes are the look and feel of the website.
<a href="theming.html">Theming</a>


What are themes?
With a simple html/css layer it should make it easier for designer to customize the presentation without having to touch the JS code.

The HTML is contained in module specific html template files and the engine is in fact underscore.
It is simple and provides for some basic logic (loops, helper functions, etc).
I try to avoid getting too clever with markup/templates as that is the place where developers and designers typically
meet so the less 'technology' between a designer and the markup/css the better.
With a simple html/css layer it should make it easier for designer to customize the presentation without having to touch the JS code.


What is the Cortex API?
-------------------
Cortex API is Elastic Path's powerful <a href="http://en.wikipedia.org/wiki/Representational_state_transfer">RESTful</a> e-commerce API.
The API can surface up data from any e-commerce backend system in a RESTful manner.

To learn more aboutb Cortex API, see <a href="http://api-cortex-developers.docs.elasticpath.com">api-cortex-developers.docs.elasticpath.com</a>

![Cortex](img/cortex-page-diagram.png)


Feature Guide
---------------------
![Feature Guide](img/featureSupport.png)


About the Documentation
---------------------
This document is written for knowledgeable JavaScript developers who are extending/customizing the HTML5 Storefront modules and
for knowledgeable front-end developers who are extending/customizing the HTML5 Storefront themes.

This document is not a primer for JavaScript, CSS, etc. Before you begin, you should have working knowledge of the following technologies:

* Backbone.js
* jQuery.js
* Marrionette.js
* CSS/{less}
* DOM/CRUD Operations

Audience
---------------------
This document is written for experienced JavaScript developers and front-end UI developers who want to learn how to customize/extend the HTML5 Storefront.