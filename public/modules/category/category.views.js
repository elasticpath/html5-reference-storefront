/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['marionette'],function(Marionette){

  var RelItemLayout = Backbone.Marionette.Layout.extend({
    template:'#RelItemLayout',
    regions:{
      elementRegion:'.element-content',
      childRegion:'.child-content',
      itemRegion:'.item-content',
      itemsRegion:'.items-content',
      otherRegion:'.other-content'
    }
  });

  var LinkItemView = Backbone.Marionette.ItemView.extend({
    template:'#LinkItemTemplate',
    tagName:'li'
  });

  var ChildRelView = Backbone.Marionette.CompositeView.extend({
    template:'#RelSummaryTemplate',
    itemViewContainer:'.summary-content',
    itemView:LinkItemView

  });

  var LinksView = Backbone.Marionette.CompositeView.extend({
    template:'#LinkTemplateContainer',
    itemViewContainer: 'ul',
    itemView: LinkItemView
  });

  var defaultLayout = function() {};
  return {
    LinksView:LinksView,
    ChildRelView:ChildRelView,
    RelItemLayout:RelItemLayout,
    DefaultView:defaultLayout
  };
});
