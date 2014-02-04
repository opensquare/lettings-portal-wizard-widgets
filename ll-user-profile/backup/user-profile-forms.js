function Widget_ll_user_profile() {
	/* widget currently controls all wireframe rf flows,
	actual implementation should have separate widgets for separate flows */
	this.user_profile = "user_profile_display";
	this.edit_user_profile = "user_profile_edit";
	
	this.initExtend = function(){
		pw.addListenerToChannel(this, this.user_profile);
		pw.addListenerToChannel(this, this.edit_user_profile);
	}

	this.activeFlow = '';
	this.initData = '';

	this.handleEvent = function(channel, event){
		
		if(!event.id && channel == this.user_profile){
			this.activeFlow = 'widgets/property-forms/user-profile-forms-flow.js';
			this.initData = '<root></root>';
		} else if (channel == this.edit_user_profile){
			this.activeFlow = 'widgets/property-forms/user-profile-forms-flow.js';
			this.initData = '<root><performAction>' + event.action + '</performAction></root>';
		} else {
			this.activeFlow = '';
		}
		this.loadHTML();
	}



/*		if(!event.id && channel == this.user_profile){
			this.activeFlow = 'widgets/ll-user-profile/user-profile-forms-flow.js';
			this.initData = '<root></root>';
		} else {
			this.activeFlow = '';
		}
		this.loadHTML();
	}*/

	this.onReadyExtend = function() {
		//this.determineFlow();

		this.activeFlow = 'widgets/ll-user-profile/user-profile-forms-flow.js';

		if (this.activeFlow != ''){
			rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-formContainer', this.$widgetDiv), this.initData);
		}
	}

}