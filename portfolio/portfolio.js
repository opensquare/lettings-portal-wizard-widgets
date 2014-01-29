function Widget_portfolio() {

	this.onReadyExtend = function() {
		$(".property").click(function(){
			hideSelectText();
			var property = $(this).attr("id");

			$(".property").each(function(){
				$(this).removeClass('selected');
			});

			$(this).addClass('selected');
			$(".tabs").removeAttr("addProperty");
			$(".tabs").attr("propertyUid", property);

			pw.notifyChannelOfEvent("property_info", {id: property});
			$(".tabs > section").each(function(){
					$(".noSelection").remove();
			});

		});

		$(".addProperty").click(function(){
			hideSelectText();
			$(".property").each(function(){
				$(this).removeClass('selected');
			});
			
			$(".tabs").removeAttr("propertyUid");
			$(".tabs").attr("addProperty", "true");

			pw.notifyChannelOfEvent("property_info", {id: false});
			$(".tabs > section").each(function(){
					$(".noSelection").remove();
			});

		});
	}

	function hideSelectText(){
		$('header', this.$widgetDiv).hide();
	}
}