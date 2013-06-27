function Widget_username() {
	
	var widgetObject = this;

	this.onReadyExtend = function(){
		$('.user-name', this.$widgetDiv).click(function(){
			$('.user-links', widgetObject.$widgetDiv).show();
		});

		$('.user-name-wrapper', this.$widgetDiv).mouseleave(function(){
			$('.user-links', widgetObject.$widgetDiv).hide();
		})
	}
}