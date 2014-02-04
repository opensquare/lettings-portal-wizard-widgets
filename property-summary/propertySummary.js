function Widget_property_summary(){

	var propertyId;
	var widgetDiv;

	this.onReadyExtend = function() {
		propertyId = this.$widgetDiv.data('propid');
		widgetDiv = this.$widgetDiv;
		this.loadProperty();
	}


	this.loadProperty = function() {
		var widgetObject = this;
		$.ajax({
			url: 'widgets/portfolio/properties.json',
			dataType: 'json',
		})
		.done(function(data) {
			var properties = data.properties;
			var articleTpl = $('article', widgetDiv);
			for (var i = 0; i < properties.length; i++) {
				var property = properties[i].property;
				if (propertyId == property.id){
					// populate article
					$('aside.image div', articleTpl).text(property.image);
					$('summary .address', articleTpl).html('<h2>' + property.address + '</h2>');
					$('summary .sub', articleTpl).text(property.subtitle);
					$('summary .description', articleTpl).text(property.description);
					$('summary .rentalStatus span', articleTpl).text(property.status);
					$('section>div', articleTpl).text(property.summary);
					widgetObject.addHandlers(articleTpl);
				}
				
			};
		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}

	this.addHandlers = function(propertySelector){
		$('aside.image, summary .address', propertySelector).click(function(){
			window.location.hash = 'property/details?' + propertyId;
			pw.notifyChannelOfEvent('property_changed', {id: propertyId});
		})
	}
}