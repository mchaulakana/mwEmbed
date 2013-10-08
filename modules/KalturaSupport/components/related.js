( function( mw, $ ) {"use strict";

	mw.PluginManager.add( 'related', mw.KBaseComponent.extend({

		defaultConfig: {
			parent: "topBarContainer",
         	order: 4,
         	align: "right",
         	//template: "<li class='relatedItems'></li>",
         	itemTemplate: '<% _.each(items, function(item) { %> \
         					<li class="item small"> \
         					<div class="name"><%=item.name%></div> \
         					<img src="<%=item.thumbnailUrl%>" /></li><% }); %>',
         	playlistId: "1_qui13sz2",         	
		},
		$screen: null,
		setup: function(){
			var _this = this;

			// Hogan templates
			this.template = _.template( this.getConfig('itemTemplate', true) );

			this.bind('playerReady', function(){
				_this.getItemsData(function(){
					if( _this.$screen ){
						_this.$screen.remove();
					}
				});
			});
		},
		getItemsData: function( callback ){
			if( !this.itemsData ){
				var _this = this;
				this.getKalturaClient().doRequest( {
					'service' : 'playlist',
					'action' : 'execute',
					'id' : this.getConfig( 'playlistId' )
				}, function( data ){
					// Add first property to our first item
					if( data.length ){
						data[0].first = true;
					}
					_this.itemsData = data;					
					callback();
				});
				return;
			}
			callback();
			return;
		},
		getItems: function(){
			return this.template({items: this.itemsData});
		},
		hide: function(){
			this.opened = false;
			this.getScreen().hide();
			this.getPlayer().restoreComponentsHover();
		},
		show: function(){
			this.opened = true;
			this.getPlayer().disableComponentsHover();
			this.getScreen().show();
		},
		toggle: function(){
			if( this.opened ){
				this.hide();
			} else {
				this.show();
			}
		},		
		getScreen: function(){
			if( ! this.$screen ){
				var _this = this;
				this.$screen = $('<div />')
									.addClass( 'screen ' + this.pluginName )
									.append( 
										$('<div class="screen-content" /> ').append(
											$('<ul />').append( _this.getItems() )
											, $('<div class="clearfix" />')
										)
									)
									.hide();

				this.getPlayer().getVideoHolder().append( this.$screen );
			}
			return this.$screen;
		},
		getComponent: function() {
			if( !this.$el ) {	
				var _this = this;
				this.$el = $( '<button />' )
							.attr( 'title', this.playTitle )
							.addClass( "btn icon-related" + this.getCssClass() )
							.click( function(){
								_this.toggle();
							});
				
			}
			return this.$el;
		}
	}));

} )( window.mw, window.jQuery );