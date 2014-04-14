---
layout: master
permalink: /
title: Home
weight: 1
---

HTML5 Storefront is a flexible e-commerce website backed by Elastic Path's Cortex API.
HTML5 Storefront, comprised of the latest technologies (JavaScript, HTML5, jQuery, CSS3, {less}, Marionette, Node.js, etc.), is designed for extensibility.

E-commerce functionality (cart, authentication, profile, search, etc.) is separated from the website's presentation, allowing
front-end developers to work on the CSS without having to touch the JavaScript, while JavaScript developers can develop
functionality without having to touch the front end. Each customization layer is separated from HTML5 Storefront's core code, so
neither developer has to touch the Storefront's engine.

###Customization Layers
JavaScript developers make their customizations in the Module Layer, while front-end developers customize the Presentation Layer.
Take a look at the [Platform Architecture]({{ site.baseurl }}/documentation/technologyoverview/) to see where the layers are positioned in regards to the rest of the system.

####Module Layer
This layer is where JavaScript developers build/extend HTML5 Storefront's functionality.
JavaScript modules are independent units of code that represent distinct pieces of functionality.
Together, the modules comprise the entire system of HTML5 Storefront functionality.
For more information on extending/customizing modules, see [Customizing Storefront Features]({{ site.baseurl }}/documentation/extending/).

**What are HTML5 Storefront modules?**

An HTML5 Storefront module is the view, plus the code backing the view. For example, the cart module is
comprised of the `cart.controller.js`, `cart.model.js`, `cart.templates.html`, and the `cart.view.js`:

![Cart Module]({{ site.baseurl }}/documentation/img/cartModule.png)

Cart functionality such as checkout, item prices, item availability, lineitems, etc. is provided by the `cart.controller` and `cart.model`.
While the view, the output representations of these features, is handled by the `cart.templates.html` and the `cart.view.js`.
HTML5 Storefront views only define the regions where the cart representation appears, while the cart's look and feel is defined through the Presentation Layer with a theme.


**Why combine view, model, controller into one module?**

This makes the modules as self-contained as possible, minimizes the references required to other modules, and saves the JS developer from having to customize the
Storefront's engine controller every time a module is added or changed.

####Presentation Layer

HTML5 Storefront has a simple Presentation Layer (html/css), allowing front-end developers to customize the look and feel without having to touch the JS code.
Front-end developers can create themes to give HTML5 Storefront different look and feels. For more information on creating a theme, see the [Theming Tutorial]({{ site.baseurl }}/documentation/theming/#tutorialTheme).




What is the Cortex API?
-------------------
Cortex API is Elastic Path's powerful [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) e-commerce API.
The API can surface up data from any e-commerce backend system in a RESTful manner.

To learn more about Cortex API, see our [Developer Portal](http://touchpoint-developers.elasticpath.com/).

![Cortex]({{ site.baseurl }}/documentation/img/cortex-page-diagram.png)


HTML5 Reference Storefront Features
---------------------
![Feature Guide]({{ site.baseurl }}/documentation/img/featureSupport.png)


About the Documentation
---------------------
This document is written for knowledgeable JavaScript developers who are extending/customizing HTML5 Storefront modules and
for knowledgeable front-end developers who are extending/customizing HTML5 Storefront themes. This document is not a primer for JavaScript, CSS, etc. Before you begin, you should have working knowledge of the following technologies:

* Backbone.js
* jQuery.js
* Marionette.js
* CSS/{less}
* DOM/CRUD Operations

Audience
---------------------
This document is written for experienced JavaScript developers and front-end UI developers who want to learn how to customize/extend HTML5 Reference Storefront.

{% include legal.html %}