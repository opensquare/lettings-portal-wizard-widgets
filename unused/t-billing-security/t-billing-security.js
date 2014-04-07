// t-security-check.js
function Widget_t_billing_security() {
	
	this.onReadyExtend = function() {
	
		this.activeFlow = 'widgets/t-billing-security/t-billing-security-flow.js';
		
		rf.loadFlow(this.activeFlow, $('.rhinoforms-billing-security-formContainer', this.$widgetDiv), this.initData);

	}

}