function Widget_user_profile_forms() {
	
	this.onReadyExtend = function() {

		var flowName = this.parameterMap.flow;
	
		this.activeFlow = 'widgets/user-profile-forms/' + flowName + '.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-forms-formContainer', this.$widgetDiv), this.initData);

	}

}