function Widget_ll_messages_home(){


	this.onReadyExtend = function() {
		
		console.log('messages');

		var message_count;

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

			// TODO: get number of unread messages, flag needed in messages json for read/unread status
			message_count = data.messages.length;

			var display_message_count = document.getElementById('message_count');

			display_message_count.innerHTML = message_count;

		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});



	}

}
