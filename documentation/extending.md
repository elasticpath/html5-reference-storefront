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
Components are units of code that are designed for reuse in other modules. In most cases, components just contain the View and the Controller.
For example, the <code>address</code> component, provides the Controller and View to create, retrieve, and view customer addresses.
<code>address</code> is reused in the <code>profile</code> and <code>receipt</code> modules, to allow customers to create, update, and view their addresses through these module's views.

**Module Creation Guidelines**

We don't have any hard and fast rules for when to create a module, we just have guidelines. You need to determine whether or not to create a new module for
the functionality you are building based on your needs.

Keep in mind Elastic Path's Guidelines for Creating New Modules:

- Base the module around a view. </br>
We base our modules around views. For example, the <code>cart</code> module contains the complete view of the cart, including the cart's lineitems, costs of the cart's contents, total quantity in the cart, and so on.
Designing the module around a view helps you encapsulate HTML5 Storefront functionality.
- Design the module to be self-contained. </br>
We design our modules so they are complete units of functionality. This means all the functionality for a given feature is encapsulated in the module.
For example, all the profiles functionality, view profile, update profile, and so on is defined in the <code>profile</code> module.
This may seem kind of obvious, but we're mentioning it as a reminder for you to try and keep your code modularized. The HTML5 Reference Storefront is on a rapid-release schedule, meaning that the code is frequently updated.
If your customized code is all over the place, you will have issues upgrading your code base.

Module Basics
---------------------

Overview of a module's components:
The descriptions below use the profile module as an example.

![profile](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/profileModule.png)

**base.profile.controller.js**

lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum

```js
 define(function (require) {
     var ep = require('ep');
     var EventBus = require('eventbus');
     var Mediator = require('mediator');
     var Backbone = require('backbone');

     var Model = require('profile.models');
     var View = require('profile.views');
     var template = require('text!modules/base/profile/base.profile.templates.html');

     $('#TemplateContainer').append(template);

     _.templateSettings.variable = 'E';

     /**
      * Renders the DefaultLayout of profile module, and fetch model from backend;
      * upon model fetch success, renders profile views in destinated regions.
      * @returns {View.DefaultLayout}
      */
     var defaultView = function () {

       // ensure the user is authenticated befor continuing to process the request
       if (ep.app.isUserLoggedIn()) {
         var defaultLayout = new View.DefaultLayout();
         var profileModel = new Model.ProfileModel();


```

**base.profile.models.js**

lorem ipsum

**base.profile.views.js**

lorem ipsum

**base.profile.templates.html**

lorem ipsum


Tutorial: Creating a New Module
---------------------
This tutorial will walk you through the process of creating a simple HTML5 Reference storefront extension, and introduce the
core concepts that JavaScript extension developers need to know along the way.

We'll be creating....

What are we going to do?
Why are we doing it?
How do we do it? (step-by-step)