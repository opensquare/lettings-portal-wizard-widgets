function Widget_ll_property_details(){
	
	var widgetObject = this,
	closeChannel = 'landlord-portal.closePage',
	propertyChangedChannel = 'property_changed',
	argsAttr = 'page.args',
	pageIdAttr = 'pageid',
	pageType = 'page-type',
	propertyId;

	this.onReadyExtend = function(){
		var args = this.$widgetDiv.attr(argsAttr);
		if(args == 'undefined' || args == 'false' || !args){
			var thisPageId = this.$widgetDiv.attr(pageIdAttr);
			pw.notifyChannelOfEvent(closeChannel, {pageId : thisPageId})
		} else {
			pw.addListenerToChannel(this, propertyChangedChannel);
			propertyId = this.$widgetDiv.attr(argsAttr);
			this.loadAddressTitle();
			this.setContainedWidgetParams();
		}
	}

	this.handleEvent = function(channel,event){
		this.$widgetDiv.attr(argsAttr, event.id);
		this.loadHTML();
	}

	this.setTitle = function(data){
		var properties = data.properties;
		for (var i = 0; i < properties.length; i++) {
			var property = properties[i].property;
			if (propertyId == property.id){	
				var e = {
					'pageId' : widgetObject.$widgetDiv.attr(pageIdAttr),
					'title' : property.address,
					'subtitle' : property.status
				}
				pw.notifyChannelOfEvent('landlord-portal.setPageTitles', e);
			}
			
		}
	}

	this.loadAddressTitle = function() {
		$.ajax({
			url: 'widgets/portfolio/properties.json',
			dataType: 'json',
		})
		.done(widgetObject.setTitle)
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}

	this.setContainedWidgetParams = function(){
		var pageTypeName = this.$widgetDiv.data(pageType);
		$('div.widget', this.$widgetDiv).each(function(){
			$(this).data('propertyId', propertyId).data(pageType, pageTypeName);
		})
	}
}