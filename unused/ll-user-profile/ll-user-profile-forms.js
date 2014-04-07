function Widget_ll_user_profile() {
	
	this.onReadyExtend = function() {
	
		this.activeFlow = 'widgets/ll-user-profile/ll-user-profile-flow.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-formContainer', this.$widgetDiv), this.initData);

	}

}
