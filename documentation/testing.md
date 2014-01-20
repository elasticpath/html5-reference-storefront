Testing
====================
Introduction to hour our storefront testing framework.


Technology
---------------------

### Unit Test
* Testem: test runner
* Mocha:  test framework
* Chai:   test assertion library
* Sinon:  test stub, mock and spy


Overview
---------------------
All test files are located within `tests` folder with exception of `testem.json`, which is located in project root folder
<test folder structure>


Configuration to add a new test
---------------------
* define dependency path inside `test.config.js` under `paths` property.
* create the test file inside `specs` folder
* adds the test file in `testrunner.html` as below

     <script type="text/javascript" charset="utf-8">
       require([
        // adds test file into test runner here
       ], runMocha);
     </script>


###### Legal Mumbo Jumbo
This document is confidential and proprietary information of Elastic Path Software Inc. Copyright © 2013 Elastic Path Software Inc. All rights reserved. Elastic Path®, the Elastic Path logo, EP Commerce Engine™, EP Cortex™, and EP Subscriptions™ are trademarks or registered trademarks of Elastic Path Software Inc. All other trademarks are the property of their respective owners.