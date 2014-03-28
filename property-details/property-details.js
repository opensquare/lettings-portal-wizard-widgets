function Widget_property_details() {
	
	this.initData=  '';

	var
		inStepContext
	;

	this.initExtend = function(){
		var completeChannel = '';
		inStepContext = this.$widgetDiv.data('step-context');
		if(inStepContext) {
			completeChannel = 'step.' + this.name;
			// clear previous listeners first
			pw.removeListenersFromChannel(completeChannel);
			pw.addListenerToChannel(this, completeChannel);
		}
		if (this.parameterMap.entity != ''){
			this.initData = '<root><id>' + this.parameterMap.entity + '</id><complete>' + completeChannel + '</complete></root>';
		}
	}

	this.onReadyExtend = function() {
		if (this.initData != ''){
			rf.loadFlow('widgets/'+this.name+'/'+this.name+'-flow.js', $('.rhinoforms-property-formContainer', this.$widgetDiv), this.initData);
		}
	}

	this.handleEvent = function(channel, event) {
		// when plugged into esb id will be returned, if block can be removed
		if (event.id == ''){
			event.id = '65955';
		}
		pw.notifyChannelOfEvent('portal.setPageArgs',{
			args: {
				property: event.id,
				step: null
			},
			updateExisting: true,
			reloadPage: true
		})
	}

}