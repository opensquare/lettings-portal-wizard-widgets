function Widget_page_manage_property(){

	this.initExtend = function(){
		var propertyUid;
		if (!pw.defined(this.parameterMap.uid)){
			propertyUid = this.$widgetDiv.data('property');
			if (pw.defined(propertyUid)){
				this.parameterMap.uid = propertyUid;
			}
		}
	}

	this.onReadyExtend = function(){
		
	}

	this.handleEvent = function(channel, event){
		
	}

}
