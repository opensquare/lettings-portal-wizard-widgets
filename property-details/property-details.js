function Widget_property_details(){

	this.initExtend = function(){
		pw.addListenerToChannel(this, "property_info");
	}

	this.handleEvent = function(channel, event){
		if (!event.id){
			$("div.existing", this.$widgetDiv).hide();
		} else {
			$("div.existing, div.desc", this.$widgetDiv).show();
		}
	}
	this.onReadyExtend = function(){
		var t = this;
		$(".actions>a", this.$widgetDiv).click(function(){
			clearScroll();
			pw.notifyChannelOfEvent("property_action", {action: $(this).text()});
			$("div.desc", t.$widgetDiv).hide();
		});
	}

	function clearScroll(){
		setTimeout(function() {
			if (location.hash) {
				window.scrollTo(0, 300);
			}
		}, 1);
	}
}