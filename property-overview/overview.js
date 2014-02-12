function Widget_property_overview(){

	var propertyId;
	var widget = this;

	var docstoreBannerPath = 'docstore/property/{id}/banner.jpg';

	this.onReadyExtend = function() {
		propertyId = this.$widgetDiv.data('propertyId');
		pageId = this.$widgetDiv.attr('pageid');
		this.setContainedWidgetParams();
	}

	this.setContainedWidgetParams = function(){
		$('div.widget', this.$widgetDiv).each(function(){
			$(this).data('propid', propertyId);
		})
	}
}