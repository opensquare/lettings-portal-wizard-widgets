function Widget_property_details() {
	
	this.initData=  '';

	this.initExtend = function(){
		if (this.parameterMap.entity != ''){
			this.initData = '<root><id>' + this.parameterMap.entity + '</id></root>';
		}
		
	}


	this.onReadyExtend = function() {
		if (this.initData != ''){
			rf.loadFlow('widgets/'+this.name+'/'+this.name+'-flow.js', $('.rhinoforms-property-formContainer', this.$widgetDiv), this.initData);
		}
	}

}