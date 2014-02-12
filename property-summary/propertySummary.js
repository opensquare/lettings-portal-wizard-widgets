function Widget_property_summary(){

	var propertyId;
	var widgetDiv;

	var docstoreThumbnailPath = 'docstore/property/{id}/thumbnail.jpg'

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
					property.image = docstoreThumbnailPath.replace('{id}', property.id);
					$('.image div', articleTpl).text(property.image);
					$('summary .address', articleTpl).html(property.address);
					$('summary .sub', articleTpl).text(property.subtitle);
					$('summary .description', articleTpl).text(property.description);
					$('summary .rentalStatus', articleTpl).text(property.status);
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
		$('.image, summary .address', propertySelector).click(function(){
			window.location.hash = 'property/details?' + propertyId;
			pw.notifyChannelOfEvent('property_changed', {id: propertyId});
		})
	}
}