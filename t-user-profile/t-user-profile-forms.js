function Widget_t_user_profile() {
	
	this.onReadyExtend = function() {
	
		this.activeFlow = 'widgets/t-user-profile/t-user-profile-flow.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-formContainer', this.$widgetDiv), this.initData);

	}

}
