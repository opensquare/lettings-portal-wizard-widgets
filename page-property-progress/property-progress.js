function Widget_page_property_progress(){

	var 
		widgetObject = this,
		closeChannel,
		argsChannel,
		propertyId,
		fasttrack,
		step
	;

	this.closeChannelAttr = 'ch-page-close',
	this.argsChannelAttr  = 'ch-page-args',
	this.propertyIdAttr   = 'property';
	this.fasttrackAttr    = 'fasttrack';
	this.stepAttr   = 'step';

	this.initExtend = function(){
		// pick up passed data
		closeChannel = this.$widgetDiv.data(this.closeChannelAttr);
		argsChannel  = this.$widgetDiv.data(this.argsChannelAttr);
		propertyId   = this.$widgetDiv.data(this.propertyIdAttr);
		step         = propertyId == 'new' ? 1 : this.$widgetDiv.data(this.stepAttr);
		fasttrack    = this.$widgetDiv.data(this.fasttrackAttr);
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
			if (pw.defined(fasttrack)) {
				paramString += '&fasttrack=' + 'true';
			}
			$(this).attr('params', paramString);
			// pass portal channels
			$(this).data(widgetObject.argsChannelAttr, argsChannel);
		})
	}
}