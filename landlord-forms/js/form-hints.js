		$("div.field").first().addClass("on");

		$('form input, form select').focus(function() {
		  $("div.field").removeClass("on");
		   $(this).closest("div.field").addClass("on")
		});

		$('form input[type="radio"], form input[type="checkbox"]').change(function() {
		  $("div.field").removeClass("on");
		   $(this).closest("div.field").addClass("on")
		});

		$("input[type='radio'], input[type='text'], input[type='checkbox'], input[type='email'], input[type='password'], select").change( function() {
  			$(this).siblings('.invalid-message').remove();
  		});

		/* Default HTML date tag */
		$('#input_date').attr("value", moment().format("YYYY-MM-DD"));
 