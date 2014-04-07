function Widget_page_property_overview(){

	var 
		widgetObject = this,
		closeChannel,
		propertyId
	;

	this.closeChannelAttr = 'ch-page-close',
	this.propertyIdAttr   = 'property';

	this.initExtend = function(){
		// pick up passed data
		closeChannel = this.$widgetDiv.data(this.closeChannelAttr);
		propertyId   = this.$widgetDiv.data(this.propertyIdAttr);
		if(!pw.defined(this.parameterMap.entity)){
			this.parameterMap.entity = propertyId;
		}
	}

	this.onReadyBeforeChildImport = function(){
		if(!pw.defined(propertyId) || propertyId === '' || !propertyId){
			this.setContent('');
			pw.notifyChannelOfEvent(closeChannel, {})
		} else {
			this.setContainedWidgetParams();
		}
	}


	this.setContainedWidgetParams = function(){
		$('div.widget', this.$widgetDiv).each(function(){
			$(this).attr('params', 'entity=' + propertyId + '&path=' + widgetObject.name);
		})
	}
}