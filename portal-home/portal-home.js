function Widget_portal_home(){

	this.onReadyExtend = function() {

		// handles the responsive classes depending on window size. Will need to re-visit as it doesn't behave exactly as it should.
		handleWindowResize();

	}

	handleWindowResize = function() {

		var windowWidth = window.innerWidth;

		if (windowWidth < 768) {
			$('.panel-collapse').removeClass('in');
		}

		if (windowWidth > 768) {
			$('.panel-collapse').addClass('in');
		}

		window.onresize = resize;

		function resize() {

			var windowWidth = window.innerWidth;

			if (windowWidth < 768) {
				$('.panel-collapse').removeClass('in');
			}

			if (windowWidth > 768) {
				$('.panel-collapse').addClass('in');
			}

		}

	}

}