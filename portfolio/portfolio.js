function Widget_portfolio() {

	var widgetDiv = this.$widgetDiv;
	

	this.onReadyExtend = function() {
		$(".property", widgetDiv).click(function(){
			var property = $(this).attr("id");

			$(".property", widgetDiv).each(function(){
				$(this).removeClass('selected');
			});

			$(this).addClass('selected');
			//$(".tabs").removeAttr("addProperty");
			//$(".tabs").attr("propertyUid", property);

			pw.notifyChannelOfEvent("property_info", {id: property});
		});

		$(".addProperty").click(function(){
			$(".property", widgetDiv).each(function(){
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
			var propertyGroup = $('.properties', widgetDiv);
			var propertyTpl = $('<div class="widget panel panel-default" name="property-summary">widget to load</div>');
			for (var i = 0; i < properties.length; i++) {
				var w = propertyTpl.clone();
				w.data("propid", properties[i].property.id);
				propertyGroup.append(w);
				pw.mount(w);
			};
			
		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}
}