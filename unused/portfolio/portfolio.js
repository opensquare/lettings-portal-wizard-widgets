function Widget_portfolio() {

	var channelSetPageTitles = 'landlord-portal.setPageTitles',
		channelToggleActions = 'toggleActions'
	;

	var widget = this,
	propertyTpl = '<div class="widget panel panel-default" name="property-summary">widget to load</div>',
	emptyPortfolioTemplate = '<div class="widget" name="blank-portfolio"></div>',
	pageId,
	args;
	

	this.onReadyExtend = function() {
		args = this.$widgetDiv.attr('page.args');
		pageId = this.$widgetDiv.attr('pageid');

		$(".addProperty").click(function(){
			$(".property", widget.$widgetDiv).each(function(){
				$(this).removeClass('selected');
			});
			window.location.hash = 'property/add';
		});
		this.loadProperties();
	}

	this.loadProperties = function() {
		$.ajax({
			url: 'widgets/portfolio/properties.json',
			dataType: 'json',
		})
		.done(function(data) {
			var properties = data.properties;
			var propertyGroup = $('.property-list', widget.$widgetDiv);
			// args == new allows display of widget for new properties for demo purposes only
			if (properties.length == 0 || args == 'new') {
				pw.notifyChannelOfEvent(channelSetPageTitles, {
					'pageId' : pageId, 
					'title' : ''
				})
				pw.notifyChannelOfEvent('toggleActions', {animate: false});
				$('.properties', widget.$widgetDiv).before(emptyPortfolioTemplate).hide();
				pw.mount($('div.widget',widget.$widgetDiv));
			} else {
				for (var i = 0; i < properties.length; i++) {
					var w = $(propertyTpl);
					w.data("propid", properties[i].property.id);
					propertyGroup.append(w);
					pw.mount(w);
				};
				
			}
			
		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}
}