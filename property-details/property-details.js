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
		$(".actions>a", this.$widgetDiv).each(function(){
			var href = $(this).attr("href");
			$(this).attr("href", href + '?' + activeProperty);
		})
		/*var t = this;
		$(".actions>a", this.$widgetDiv).click(function(){
			pw.notifyChannelOfEvent("property_action", {action: $(this).text()});
			$("div.desc", t.$widgetDiv).hide();
		});*/
	}
}