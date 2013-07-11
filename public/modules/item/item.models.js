define([
	"app",

	// Libs
	"backbone",

	// Modules
	"cortex",
	"URI",

	// Plugins
	"jsonpath"
	],

	function(app, Backbone, Cortex, URI) {
		var ItemModels = {};

		var itemMedia = Backbone.Cortex.Model.extend({
			zoom: 'assets:element',
			urlRoot: function () {
				return app.config.url + '/itemdefinitions/' + app.config.store;
			},
			initialize: function (attributes, options) {
				Backbone.Cortex.Model.prototype.initialize.call(this, options);
				this.name = attributes.name;
			},
			afterParse: function (response, model) {
				var mediaArray = _.first(jsonPath(response, "$..[':assets']..[':element']"));
				if (mediaArray == null) {
					return model;
				}
				var media = _.findWhere(mediaArray, {name: "default-image"});
				if (media) {
					model["content-location"] = media["content-location"];
					model["name"] = this.name;
				}
				return model;
			}
		});

		var itemPrice = Backbone.Cortex.Model.extend({
			afterParse: function (response, model) {
				model['list-price'] = _.first(jsonPath(response, "$..['list-price'][0]"));
				model['purchase-price'] = _.first(jsonPath(response, "$..['purchase-price'][0]"));
				return model;
			}
		});

		var itemDefinition = Backbone.Cortex.Model.extend({
			afterParse: function (response, model) {
				_.extend(model, _.pick(response, "display-name"));
				model["media"] = new itemMedia({ id: model.self.id, name: model["display-name"]});
				return model;
			}
		});

		//Item model
		var item = Backbone.Cortex.Model.extend({
			zoom: 'price,definition',
			urlRoot: function () {
				return app.config.url + '/items/' + app.config.store;
			},
			afterParse: function (response, model) {
				var price, definition;

				price = _.first(jsonPath(response, "$..[':price'][0]"));
				definition = _.first(jsonPath(response, "$..[':definition'][0]"));

				if (price) {
					model.price = new itemPrice(price, { parse: true });
				}

				if (definition) {
					model.definition = new itemDefinition(definition, { parse: true, id: model.self.id});
				}
				return model;
			},
			addToCart: function (quantity, options) {
				options = options || {};
				var follow = options.followLocation || false;
				var zoom = options.zoom;
				var formLink = this.get("links").addtocartform;
				var form = new Backbone.Cortex.Model( {self: formLink.createSelf()} );

				form.fetch( {success: function(resp, status, xhr) {
					var link = resp.get("links").addtodefaultcartaction;
					var linkhref;

					if (!link && options.notavailable && _.isFunction(options.notavailable)) {
						options.notavailable();
						return;
					} 
					linkhref = URI(link.href);
					if (follow) {
						linkhref.addSearch("followLocation", "");
					}
					if (zoom) {
						linkhref.addSearch("zoom", zoom);
					}
					$.jsonAjax({
						type: 'POST',
						url: linkhref.toString(),
						data: JSON.stringify({quantity: quantity}),
						error: options.error,
						success: options.success
					});					
				}} );
			}		
		});

		var items = Backbone.Cortex.Collection.extend({
			model: item
		});

	// Required, return the module for AMD compliance
	return {
    ItemMedia:itemMedia,
    ItemPrice:itemPrice,
    ItemDefinition:itemDefinition,
    Item:item,
    Items:items
  };
});

