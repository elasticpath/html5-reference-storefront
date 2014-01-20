/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 */





define(['ep','underscore','backbone','URI','eventbus'],

	function(ep, _, Backbone, URI,EventBus) {
		Backbone.Cortex = {};

		Backbone.Cortex.parseId = function (string) {
			var matches = string.match(/[^\/]+$/);
			if (!matches || matches.length > 1) {
				return null;
			}
			return matches[0].split('?')[0];
		};

		var Self = Backbone.Cortex.Self = function(params, options) {
			var opts = options || {};
			_.extend(this, _.pick(params, "type", "uri", "href", "max-age"));
			if (this.uri) {
				if(opts.parseId && _.isFunction(opts.parseId)) {
					this.id = opts.parseId(this.uri);
				} else {
					this.id = Backbone.Cortex.parseId(this.uri);
				}
			}
		};

		// Attach all inheritable methods to the Self prototype.
		_.extend(Self.prototype, {

		});

		var Link = Backbone.Cortex.Link = function(params) {
			_.extend(this, _.pick(params, "type", "uri", "href", "rel", "rev"));

			if (this.uri) {
				this.id = Backbone.Cortex.parseId(this.uri);
			}
		};

		// Attach all inheritable methods to the Link prototype.
		_.extend(Link.prototype, {
			createSelf: function() {
				return new Backbone.Cortex.Self(this);
			}
		});

		var setupLoadingEvents = function(modelOrCollection) {
			modelOrCollection.on("request", function() {
				modelOrCollection.set("loading",true);
			});	
			modelOrCollection.on("sync", function() {
				modelOrCollection.set("loading",false);
			});	
			modelOrCollection.on("error", function() {
				modelOrCollection.set("loading",false);
			});				
		};

		Backbone.Cortex.Model = Backbone.Model.extend({
			validForms: [],
			zoom: null,
			loading: false,
			parseId: null,
			url: function() {
				var uriSelf, baseUrl;
				if (this.get("self") && this.get("self").href) {
					baseUrl = this.get("self").href;
				} else {
					baseUrl = Backbone.Model.prototype.url.call(this);
				}
				if (this.zoom) {
					uriSelf = URI(baseUrl);
					uriSelf.removeSearch("zoom").addSearch("zoom", this.zoom);
					return uriSelf.toString();
				} 
				return baseUrl;
			},
			// Override parse automatically create hypermedia specific attributes on the model
			parse: function(response, xhr) {
        ep.logger.info('|------------------------------');
        ep.logger.info('|');
        ep.logger.info('| Response 1)');
        ep.logger.info('|');
        ep.logger.info('|        ' + JSON.stringify(response));
        ep.logger.info('|');
        ep.logger.info('|------------------------------');
				var retVal = {};
				// pre parse hook
				if (_.isFunction(this.beforeParse)) {
					_.extend(retVal, this.beforeParse(response, xhr));
				}	

				// Construct the self if it exists
				if (response && response.self) {
					retVal.self = new Backbone.Cortex.Self(response.self, {parseId: this.parseId});	
					if (retVal.self.id) {
						retVal[this.idAttribute] = retVal.self.id;
					}
				}

				// Construct the links if they exist
				retVal.links = {};
				if (response && response.links) {
					_.each(response.links, function(link) {
						retVal.links[link.rel] = new Backbone.Cortex.Link(link);
					});					
				}


				// Construct the form if it exists
				retVal.forms = {};
				_.each(this.validForms, function(form) {
					if(response && response[form] && response[form][0]) {
						// All zooms start with :
						var formName = form.split(":")[1];
						if (!formName) {
							formName = form;
						}
						retVal.forms[formName] = new Backbone.Cortex.Form(response[form][0], { parse:true} ); 
					}
				});

				// post parse hook
				if (_.isFunction(this.afterParse)) {
					retVal = this.afterParse(response, retVal, xhr);
				}
        ep.logger.info('|------------------------------');
        ep.logger.info('|');
        ep.logger.info('| Response 2)');
        ep.logger.info('|');
        ep.logger.info('|        ' + JSON.stringify(retVal));
        ep.logger.info('|');
        ep.logger.info('|        ' + JSON.stringify(response));
        ep.logger.info('|');
        ep.logger.info('|------------------------------');

        return retVal;
			},
			toJSON: function() {
				// automatically add any Cortex submodels to the JSON
				var json = Backbone.Model.prototype.toJSON.call(this);
				var self = this;
				_.each(_.keys(this.attributes), function(key) {
					if(self.attributes[key] instanceof Backbone.Cortex.Model || self.attributes[key] instanceof Backbone.Cortex.Collection) {
						json[key] = self.attributes[key].toJSON();
					}				
				});
				// loading state should not be exposed 
				return _.omit(json, "loading");
			},
			initialize: function(options) {
				Backbone.Model.prototype.initialize.call(this, options);				
				setupLoadingEvents(this);
			}
		});

		Backbone.Cortex.Form = Backbone.Cortex.Model.extend({
			afterParse: function (response, model) {
				_.extend(model, _.omit(response, "self", "links"));
				return model;
			}
		});

		Backbone.Cortex.Collection = Backbone.Collection.extend({		
			initialize: function(options) {
				Backbone.Collection.prototype.initialize.call(this, options);
				//setupLoadingEvents(this);
			}			
		});

		Backbone.Cortex.SelectorChoice = Backbone.Cortex.Model.extend({
			select: function(options) {
				var that = this;
				var success = options.success || function() {};
				// already chosen, no need to hit the server
				if (this.get('chosen')) {
					success();
					return;
				}
				// selection changed. let the server know
				$.jsonAjax({
					type: 'POST',
					url: this.get("links").selectaction.href
				}).done(function() {
					_.each(that.collection.models, function(choice) {
						choice.set("chosen", false);
					});
					that.set("chosen", true);
					success();
				});
			}
		});

		Backbone.Cortex.SelectorChoices = Backbone.Cortex.Collection.extend({
			model: Backbone.Cortex.SelectorChoice,
			// Sort collection by default based on URI so that we get predictable ordering
			comparator: function(model) {
				return model.get("self").uri;
			}
		});

		Backbone.Cortex.Selector = Backbone.Cortex.Model.extend({
			zoom: 'choice,choice:description,chosen,chosen:description',
			choicesClass: Backbone.Cortex.SelectorChoices,
			initialize: function(options) {
				Backbone.Cortex.Model.prototype.initialize.call(this, options);
				var opts = options || {};
				if (opts.choicesClass) {
					this.choicesClass = opts.choicesClass;
				}
			},			
			parse: function(response, xhr) {
				var retVal = Backbone.Cortex.Model.prototype.parse.call( this, response, xhr );

				// parse chosen and choices. Extending class will parse this in afterParse
				if (response[':chosen'] && response[':chosen'][0]) {
					response[':chosen'][0].chosen = true;
				}
				_.each(response[':choice'], function(choice) {
					choice.chosen = false;
				});

				retVal.choices = new this.choicesClass(_.compact(_.union(response[':chosen'], response[':choice'])), {parse: true} );
				return retVal;
			}			
		});		

		// Required, return the module for AMD compliance
		return Backbone.Cortex;

	});
