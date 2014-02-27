function Widget_page_user_profile() {
	
	this.onReadyExtend = function() {

		this.activeFlow = 'widgets/page-user-profile/user-profile-flow.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-formContainer', this.$widgetDiv), this.initData);

	}

}
