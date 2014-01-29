function Widget_manage(){

	this.initExtend = function(){
		pw.addListenerToChannel(this, this.$widgetDiv.data("channel"));
	}

	this.onReadyExtend = function(){
		$(".content-pane .tabs", this.$widgetDiv).hide();
		clearScroll();
		$(".tabs section>h2>a", this.$widgetDiv).click(clearScroll);
	}

	this.handleEvent = function(channel, event){
		$(".content-pane .tabs", this.$widgetDiv).show();
	}

	function clearScroll(){
		setTimeout(function() {
		if (location.hash) {
				window.scrollTo(0, 300);
			}
		}, 1);
	}
}
