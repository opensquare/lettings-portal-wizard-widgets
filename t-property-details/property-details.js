// t-security-check.js
function Widget_t_property_details() {
	
	this.onReadyExtend = function() {
	
		setTitle();

	}

	function setTitle() {

		var pageTitle = document.getElementsByClassName('pagetitle')[0];

		pageTitle.innerHTML = '<h2>Current Tenancy</h2>'; // TODO: get this from page.title

	}

}