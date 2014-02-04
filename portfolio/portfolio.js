function Widget_portfolio() {

	var widgetDiv = this.$widgetDiv;
	this.onReadyExtend = function() {
		$(".property", widgetDiv).click(function(){
			var property = $(this).attr("id");

			$(".property", widgetDiv).each(function(){
				$(this).removeClass('selected');
			});

			$(this).addClass('selected');
			//$(".tabs").removeAttr("addProperty");
			//$(".tabs").attr("propertyUid", property);

			pw.notifyChannelOfEvent("property_info", {id: property});
		});

		$(".addProperty").click(function(){
			$(".property", widgetDiv).each(function(){
				$(this).removeClass('selected');
			});
			window.location.hash = 'property/add';
			});
	}
}