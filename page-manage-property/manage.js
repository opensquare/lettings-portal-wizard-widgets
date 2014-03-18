function Widget_page_manage_property(){

	this.initExtend = function(){
		var propertyUid;
		if (!pw.defined(this.parameterMap.uid)){
			propertyUid = this.$widgetDiv.data('property');
			if (pw.defined(propertyUid)){
				this.parameterMap.uid = propertyUid;
			}
		}

		// secondary layout test. Should be removed and config updated if not required for main build
		if(propertyUid == 'columns' || propertyUid == 'rows' || propertyUid == 'single') {
			this.parameterMap.uid = '{uid}';
			this.parameterMap.show = propertyUid;
		}
		if (propertyUid == 'rows') {
			pw.addListenerToChannel(this, 'panel-rows');
		}
	}

	this.onReadyExtend = function(){
		
	}

	this.handleEvent = function(channel, event){
		setColumns(event.id);
	}

	function setColumns(widgetid){
		var 
			colDefinition = [3,3,2,2,2],
			panelWidget = $('#' + widgetid)
		;
		$('.items-container', panelWidget).addClass('row');
		for (var i = 0; i < colDefinition.length; i++) {
			$('.ic-item-set', panelWidget).eq(i).addClass('col-sm-' + colDefinition[i]);
		};
	}

}
