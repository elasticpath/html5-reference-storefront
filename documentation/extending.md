Customizing HTML5 Features
====================
HTML5 Reference Storefront functionality is divided into modules. For example, profile, cart, authentication, checkout, and so on are all separate modules.
An HTML5 Storefront module is the view, plus the code backing the view. This means each module is its own Model View Controller (MVC) component.
For example, the profile module contains all code to retrieve and update a customer's profile data in Cortex API (Model and Controller) and contains the HTML and JS code to show the customer's profile data in the Storefront (View).

HTML5 Storefront Modular Design Benefits:
* Customizable - Add a new feature by creating a new module and adding it to the <code>module</code> folder, as opposed to modifying multiple pieces of code throughout the Storefront to create functionality.
* Maintainable - The Storefront's modular architecture enables you to make changes, i.e. add new functionality, enhance existing functionality, without breaking the entire system.
* Debuggable - Debug individual modules to isolate HTML5 Storefront issues, rather than debugging vast amounts of JS code.
* Updatable - The HTML5 Reference Storefront is continually being developed. With your customized features and enhancements in distinct modules, you can more easily update the out-of-the-box code without overwriting your custom code.

**HTML5 Reference Storefront Modules**
![List of Modules](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/modulesList.png)

**Components vs Modules**

You'll notice the <code>modules</code> folder also contains a <code>components</code> folder.
Components are very similar to modules, but their purpose is slightly different. Modules are complete, stand-alone units of functionality, which include a Model, View, and Controller.
Components are units of code that are designed to be reused in other modules. In most cases, components just contain the View and the Controller.
For example, the <code>address</code> component, provides the Controller and View to create, retrieve, and view customer addresses.
<code>address</code> is reused in the <code>profile</code> and <code>receipt</code> modules, to allow customers to create, update, and view their addresses through these module's views.

**Module Creation Guidelines**

We don't have any hard and fast rules for when to create a module, we just have guidelines. You--the programmer--need to determine whether or not to create a new module for
the functionality you are building for your HTML5 Storefront.

Below are Elastic Path's guidelines for creating new modules for the HTML5 Storefront.

Module Guidelines
- We base our modules around views. For example, the profiles
- We design our modules to be reusable.
- We design our modules to be standalone components, meaning

Module Basics
---------------------

Overview of a module's components:
The descriptions below use the profile module as an example.
![profile](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/profileModule.png)

base.profile.controller.js
base.profile.models.js
base.profile.views.js
base.profile.templates.html



Tutorial: Creating a New Module
---------------------
This tutorial will walk you through the process of creating a simple HTML5 Reference storefront extension, and introduce the
core concepts that JavaScript extension developers need to know along the way.

We'll be creating....

What are we going to do?
Why are we doing it?
How do we do it? (step-by-step)