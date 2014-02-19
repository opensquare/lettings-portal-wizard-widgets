function Widget_ll_property_edit(){
	var closeChannel = 'landlord-portal.closePage',
		channelPropertyInfo = 'property_info',
		channelSetPageTitles = 'landlord-portal.setPageTitles';
	
	var argsAttr = 'page.args',
		pageIdAttr = 'pageid';

	this.propertyId = '';
	this.titleSet = false;


	this.onReadyExtend = function(){
		var args = this.$widgetDiv.attr(argsAttr);
		if(args == 'undefined' || args == 'false'){
			var thisPageId = this.$widgetDiv.attr(pageIdAttr);
			pw.notifyChannelOfEvent(closeChannel, {pageId : thisPageId})
		} else {
			argsArray = args.split('&');
			params = [];
			for (var i = 0; i < argsArray.length; i++){
				var keyVal = argsArray[i].split('=');
				if(keyVal.length == 2){
					params[keyVal[0]] = keyVal[1];
				} else {
					params.push(argsArray[i]);
				}
			}
			this.propertyId = params['p'];
			pw.addListenerToChannelReplayLast(this, channelPropertyInfo);
			if (!this.titleSet){
				this.loadAddressTitle();
			}
		}
	}

	this.handleEvent = function(channel, event){
		this.setTitle(event);
	}

	this.setTitle = function(property){
		if (this.propertyId == property.id){	
			var e = {
				'pageId' : this.$widgetDiv.attr(pageIdAttr),
				'title' : property.address.addressLine1,
				'subtitle' : 'edit',
				'link' : {
					'text' : '&lt;&lt;&lt; Property Overview',
					'hash' : '#property/details?' + this.propertyId
				}
			}
			pw.notifyChannelOfEvent('landlord-portal.setPageTitles', e);
			this.titleSet = true;
		}
	}

	this.loadAddressTitle = function() {
		var widgetObject = this;
		$.ajax({
			url: 'widgets/portfolio/properties.json',
			dataType: 'json',
		})
		.done(function(data){
			var properties = data.properties;
			for (var i = 0; i < properties.length; i++) {
				var property = properties[i].property;
				if (property.id == widgetObject.propertyId) {
					widgetObject.setTitle(property);
				}
			}
		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}
}