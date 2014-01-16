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
The descriptions below use our template module to describe the basic components of a standard Storefront module.

![profile](https://github.elasticpath.net/cortex/ui-storefront/raw/master/documentation/img/profileModule.png)

**tmpl.controller.js**

lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum

```js



```

**tmpl.models.js**

lorem ipsum

**base.profile.views.js**

lorem ipsum

**tmpl.templates.html**

lorem ipsum


Tutorial: Creating a New Module
---------------------
This tutorial will walk you through the process of creating a HTML5 Reference storefront extension, and introduce the
core concepts that JavaScript extension developers need to know along the way.

1. Copy the Template.
2. Define your module so RequireJS can add it as a dependency. In <code>public/router.js</code>, add the following

    ```js
     define(function (require) {
         var ep = require('ep');
         var EventBus = require('eventbus');

    ```
3. Add your module to the router in <code>public/router.js</code>:

    ```js
    var router = Marionette.AppRouter.extend({
          appRoutes:{
            '': 'index',
            'home': 'index',
            'category' : 'category',
            'category/:href' : 'category',
            'category/:href/:pagehref' : 'category',
            'search' : 'search',

    ```

4. You need to load your module views into this file so the application can understand where and how to load your views. In <code>public/router.js</code>, add:

     ```js
      var loadRegionContentEvents = {
         appHeader: function() {
           EventBus.trigger('layout.loadRegionContentRequest',{
             region:'appHeaderRegion',
             module:'appheader',
             view:'AppHeaderView'
           });
         },

     ```

5. Update the code!!!