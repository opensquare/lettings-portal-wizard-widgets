function Widget_property_details(){

	var activeProperty;
	this.initExtend = function(){
		pw.addListenerToChannel(this, "property_info");
	}

	this.handleEvent = function(channel, event){
		activeProperty = event.id;
		if (event.id){
			this.loadHTML();
		}
	}

	this.onReadyExtend = function(){
		if (activeProperty = 'undefined') {
			activeProperty = this.$widgetDiv.data('propertyId');
		}
		$('div.widget', this.$widgetDiv).each(function(){
			$(this).data('propid', activeProperty);
		})
		$(".actions>button", this.$widgetDiv).each(function(){
			var href = $(this).attr("href") + '?' + activeProperty;
			$(this).click(function(){
				window.location.hash = href;
			})
		})
		/*var t = this;
		$(".actions>a", this.$widgetDiv).click(function(){
			pw.notifyChannelOfEvent("property_action", {action: $(this).text()});
			$("div.desc", t.$widgetDiv).hide();
		});*/
	}
}