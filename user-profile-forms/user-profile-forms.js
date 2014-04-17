function Widget_user_profile_forms() {
	
	this.onReadyExtend = function() {

		var flowName = this.parameterMap.flow;
		var userAT = $('#userat', this.$widgetDiv).val();
		var userTp = $('#usertp', this.$widgetDiv).val();

		// valid flow name is passed
		switch (flowName) {
			case 'user-profile-contact-flow':
				context = 'contact';
				break;
			case 'user-profile-details-flow':
				context = 'details';
				break;
			default:
				flowName = 'user-profile-login-flow';
				context = 'login';
		}

		this.activeFlow = 'widgets/user-profile-forms/' + flowName + '.js';
		var initData = '<user><userId>' + userAT + '</userId><userType>' + userTp + '</userType><type>' + context + '</type></user>';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-user-profile-forms-formContainer', this.$widgetDiv), initData);

	}

}
