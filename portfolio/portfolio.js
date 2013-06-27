function Widget_portfolio() {

	this.onReadyExtend = function() {
		$(".property").click(function(){
			var property = $(this).attr("id");

			$(".property").each(function(){
				$(this).removeClass('selected');
			});

			$(this).addClass('selected');

			$(".tabs").attr("propertyUid", property);
			pw.notifyChannelOfEvent("property_info");
			$(".tabs > section").each(function(){
					$(".noSelection").remove();
			});
		})
	}
}