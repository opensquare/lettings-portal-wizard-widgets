function Widget_ll_messages_home(){


	this.onReadyExtend = function() {
		
		console.log('messages');

		$.ajax({
			url: 'widgets/ll-messages-home/messages.json',
			dataType: 'json',
		})
		.done(function(data) {
			
			var message_list = document.getElementById('message_list');

			for (var i=0;i<data.messages.length;i++) {
				
				var elem = document.createElement('tr');

				elem.innerHTML = 

				'<td><a href=\"message#' + data.messages[i].message.id + '\"><span class="glyphicon glyphicon-envelope"></span> ' + data.messages[i].message.from + '</td>' +
				'<td><a href=\"message#' + data.messages[i].message.id + '\">' + data.messages[i].message.title + '</a></td>' +
				'<td>' + data.messages[i].message.date + '</td>';

				message_list.appendChild(elem);

			}

		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});

	}

}