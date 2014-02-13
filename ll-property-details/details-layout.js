function Widget_ll_property_details(){
	
	var widgetObject = this,
	closeChannel = 'landlord-portal.closePage',
	channelPropertyInfo = 'property_info',
	argsAttr = 'page.args',
	pageIdAttr = 'pageid',
	pageType = 'page-type',
	propertyId;

	this.titleSet = false;
	
	this.onReadyExtend = function(){
		var args = this.$widgetDiv.attr(argsAttr);
		if(args == 'undefined' || args == 'false' || !args){
			var thisPageId = this.$widgetDiv.attr(pageIdAttr);
			pw.notifyChannelOfEvent(closeChannel, {pageId : thisPageId})
		} else {
			propertyId = this.$widgetDiv.attr(argsAttr);
			pw.addListenerToChannelReplayLast(this, channelPropertyInfo);
			if (!this.titleSet){
			this.loadAddressTitle();
			}
			this.setContainedWidgetParams();
		}
	}

	this.handleEvent = function(channel,event){
		this.setTitle(event);
	}

	this.setTitle = function(property){
			if (propertyId == property.id){	
				var e = {
					'pageId' : widgetObject.$widgetDiv.attr(pageIdAttr),
					'title' : property.address,
				'subtitle' : property.status,
				'link' : {
					'text' : '&lt;&lt;&lt; My Properties',
					'hash' : '#'
				}
				}
				pw.notifyChannelOfEvent('landlord-portal.setPageTitles', e);
			this.titleSet = true;
		}
	}

	this.loadAddressTitle = function() {
		$.ajax({
			url: 'widgets/portfolio/properties.json',
			dataType: 'json',
		})
		.done(function(data){
			var properties = data.properties;
			for (var i = 0; i < properties.length; i++) {
				var property = properties[i].property;
				if (property.id == propertyId) {
					widgetObject.setTitle(property);
				}
			}
		})
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