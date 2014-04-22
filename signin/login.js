// Page Custom JavaScript - (c) Open Square, 2012
// ==============================================
//
// This file should be minified for production use.
//

function Widget_signin() {
	
	this.onReadyExtend = function() {
		var widget = this;
		this.setupLoginForm();
		this.setupResetForm();
		this.setUpRegisterForm();
	}

	this.setUpRegisterForm = function() {
		var 
			url = window.location.hash,
			hash = url.substring(url.indexOf('#')+1).length > 0 ? url.substring(url.indexOf('#')+1) : 'landlord',
			register_btn = $("#register-button")
		;
		register_btn.click(function(event) {
			var 
				register_email = document.getElementById('register_email').value,
				formSet = hash + "-registration" + '?email=' + register_email
			;
			$("#formSet").attr("href", formSet);
		});
		$("#formSet").click(function(event) {
			var 
				register_email = document.getElementById('register_email').value,
				formSet = hash + "-registration" + '?email=' + register_email
			;
			$(this).attr("href", formSet);
		});
		
	}
		
	this.setupLoginForm = function() {
		var widget = this;
		var $form = $('#login-form-enter');
		var $messages = $($form, '.messages');
		var username = queryURL()['u'];
		$form.submit(function() {
			pw.disableForm($form);
			var jqxhr = $.ajax({
				url: 'login',
				type: 'POST',
				data: $form.serialize()
			}).done(function() {
				window.location = $form.attr('nextWidget');
			}).fail(function() {
				httpStatus = jqxhr.status;
				pw.enableForm($form);
				switch (httpStatus) {
					case 401:
						widget.addInfo('Invalid username or password. Please try again.', $messages);
						break;
					default:
						widget.addError('Problem while loading (' + httpStatus + ')', $messages);
				}
			});
			return false;
		});

		if(username != '' && pw.defined(username)){
			$(':input[name=username]', $form).val(decodeURIComponent(username));
		}
	}
	
	this.setupResetForm = function() {
		var widget = this;
		var $form = $('#login-form-reset');
		var $messages = $($form, '.messages');
		$form.submit(function() {
			pw.disableForm($form);
			var jqxhr = $.ajax({
				url: 'forgottenPassword',
				type: 'POST',
				data: $form.serialize()
			}).done(function() {
				widget.addInfo('In a few moments you should receive an email with details of how to reset your password.', $messages);
				$('#login-form form').toggle();
			}).fail(function() {
				httpStatus = jqxhr.status;
				pw.enableForm($form);
				switch (httpStatus) {
					case 400:
						widget.addInfo('Invalid email address. Please check and try again.', $messages);
						break;
					default:
						widget.addError('Problem while loading (' + httpStatus + ')', $messages);
				}
			});
			return false;
		});
	}
	

	function queryURL() {
		var 
			result = {}, queryString = location.search.slice(1),
			re = /([^&=]+)=([^&]*)/g, 
			m
		;

		while (m = re.exec(queryString)) {
			result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}

		return result;
	}
}