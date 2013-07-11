/**
 * Created with JetBrains WebStorm.
 * User: sbrookes
 * Date: 18/03/13
 * Time: 11:50 AM
 * To change this template use File | Settings | File Templates.
 */
var user = require('./user');
var composer = require('./composer');
var files = require('./files');


module.exports = function(app){

  /*
   *
   * ROUTES
   *
   * */
//app.get('/', routes.index);
  // users
  app.get('/users', user.list);

  // composer
  app.get('/modules', composer.getModuleList);
  app.get('/modulefiles/:module', composer.getModuleFileList);
  app.get('/editfile/:moduleName/:fileName', files.getModuleFile);
  app.put('/file',composer.saveFile);
  app.get('/cssfiles', composer.getCSSFileList);
  app.get('/cssfiles/:dir/:fileName', composer.getCSSFile);
  app.put('/cssfiles',composer.saveCSSFile);
  app.put('/themedata',files.saveThemeConfigFile);
  app.post('/cssfiles',files.addNewLessFile);


};
