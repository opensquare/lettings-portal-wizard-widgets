function Widget_page_property_progress(){

	var 
		pageData = {}
	;

	this.initExtend = function(){
		// pick up passed data
		pageData = this.$widgetDiv.data();
	}

	this.onReadyBeforeChildImport = function(){
		var propertyId = pageData.arguments.property;

		// propagate page data to child widgets
		if(!pw.defined(propertyId) || propertyId === '' || !propertyId){
			this.setContent('');
			pw.notifyChannelOfEvent(pageData.portalChannels.gotoHomePage, {});
		} else {
			pageData.identifier = propertyId;
			this.setContainedWidgetParams();
		}
	}


	this.setContainedWidgetParams = function(){
		$('div.widget', this.$widgetDiv).data('page-data', pageData);
	}
}