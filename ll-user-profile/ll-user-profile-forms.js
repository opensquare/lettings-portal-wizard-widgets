function Widget_ll_user_profile() {
	/* widget currently controls all wireframe rf flows,
	actual implementation should have separate widgets for separate flows */
	this.propertyChannel = "user_profile_display";
	this.actionChannel = "user_profile_edit";

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
		} else if (channel == this.actionChannel){
			this.activeFlow = 'widgets/property-forms/temp-flow.js';
			this.initData = '<root><performAction>' + event.action + '</performAction></root>';
		} else {
			this.activeFlow = '';
		}
		this.loadHTML();
	}

	this.onReadyExtend = function() {
	
		this.activeFlow = 'widgets/ll-user-profile/ll-user-profile-flow.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-formContainer', this.$widgetDiv), this.initData);
		
	}

}