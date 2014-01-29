function Widget_property_forms() {
  
	this.propertyChannel = "property_info";
	this.actionChannel = "property_action";
	this.initExtend = function(){
		pw.addListenerToChannel(this, this.propertyChannel);
		pw.addListenerToChannel(this, this.actionChannel);
	}

	this.activeFlow = '';
	this.initData = '';

	this.handleEvent = function(channel, event){
		if(!event.id && channel == this.propertyChannel){
			this.activeFlow = 'widgets/property-forms/property-forms-flow.js';
			this.initData = '<root></root>';
			this.loadForms()
		} else if (channel == this.actionChannel){
			this.activeFlow = 'widgets/property-forms/temp-flow.js';
			this.initData = '<root><performAction>' + event.action + '</performAction></root>';
			this.loadForms();
		} else {
			this.loadHTML();
		}
	}



  this.onReadyExtend = function() {
    
  }

	this.loadForms = function(){
		rf.loadFlow(this.activeFlow, $('.rhinoforms-property-formContainer', this.$widgetDiv), this.initData);
  } 
}