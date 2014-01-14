Customizing HTML5 Features
====================
HTML5 Reference Storefront features are divided into modules. For example, profile, An HTML5 Storefront module is the view, plus the code backing the view.
For example, profile functionality, such as view a customers profile details (username,

How do we determine what features go into a module.


We've built the HTML5 Storefront with this extension methodology.

The HTML5 Reference Storefront is comprised of multiple modules. Each module is an independent unit of code that is responsible for a single piece of functionality in the
storefront. The



![List of Modules](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/modulesList.png)


How did we break up our modules?
We have have guidelines for how we broke the modules out. We don't have hard and fast rules. If you

Components
Components are reusable pieces of code that can be used in other modules. For example, the address component is used in profiles

Guidlines
- usually around page views
- designed for reuse capabilities
-

Module Basics
---------------------
Overview of the HTML5 MVC Framework

base.profile.controller.js
base.profile.models.js
base.profile.views.js
base.profile.templates.html



Tutorial: Extending Items
---------------------
This tutorial will walk you through the process of creating a simple HTML5 Reference storefront extension, and introduce the
core concepts that JavaScript extension developers need to know along the way.

We'll be creating....

What are we going to do?
Why are we doing it?
How do we do it? (step-by-step)