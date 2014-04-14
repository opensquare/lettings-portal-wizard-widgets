function Widget_page_user_profile(){
	
	var 
		pageData = {}
	;

	this.initExtend = function(){
		// pick up passed data
		pageData = this.$widgetDiv.data();
	}

	this.onReadyBeforeChildImport = function(){
		// propagate page data to child widgets
		this.setContainedWidgetParams();
	}

	this.setContainedWidgetParams = function(){
		$('div.widget', this.$widgetDiv).data('page-data', pageData);
	}
}
