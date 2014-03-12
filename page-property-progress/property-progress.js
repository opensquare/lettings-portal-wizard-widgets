function Widget_page_property_progress(){

	var 
		widgetObject = this,
		closeChannel,
		propertyId,
		step
	;

	this.closeChannelAttr = 'ch-page-close',
	this.propertyIdAttr   = 'property';
	this.stepAttr   = 'step';

	this.initExtend = function(){
		// pick up passed data
		closeChannel = this.$widgetDiv.data(this.closeChannelAttr);
		propertyId   = this.$widgetDiv.data(this.propertyIdAttr);
		step         = this.$widgetDiv.data(this.stepAttr);
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
			var paramString = 'entity=' + propertyId + '&path=' + widgetObject.name;
			if (pw.defined(step)) {
				paramString += '&step=' + step;
			}
			$(this).attr('params', paramString);
		})
	}
}