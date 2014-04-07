function Widget_documents_upload() {
	

	this.onReadyExtend = function() {

			var searchTerm =  $(".tabs").attr("propertyuid");
			
			$("#docUpload input[type=file]").change(function(event) {
			  $('#uploadMsg').empty();
			  $('#userDesc').val('');
			  $.each(event.target.files, function(index, file) {
			  	
			  	$("#docUpload input[type=button]").show();
			    var reader = new FileReader();
			    reader.onload = function(event) {  
			      object = {};
			      object.filename = file.name;
			      object.filetype = file.type;
			      object.data = event.target.result;
			    };  
			    reader.readAsDataURL(file);
			  });
			});
			 
			$("#docUpload input[type=button]").click(function(form) {
				
				var userDescription = ($('#userDesc').val() == "") ? "Not supplied" : $('#userDesc').val();
				var jobDesc = object.filename + '|'  + $(".title").html() + '|'  + userDescription + '|'  + object.filetype;
				var rawBase64 = object.data.replace('data:application/pdf;base64,','');

			    $.ajax({url: "proxy/mailmerger/submitjob",
			          type: 'POST',
			          data: {
			          	username: "osl", 
			          	description: jobDesc,
			          	jobType: "DELIVERY",
			          	searchTerms: searchTerm,
			          	payload: '<?xml version="1.0"?>\
			      					<mmJob xmlns="http://www.opensquare.co.uk/mmJob">\
				      					<destinations>\
				      						<store><saveAsFileName>' + object.filename +'</saveAsFileName></store>\
				      					</destinations>\
				      					 <documents>\
									        <file type="pdf">'+rawBase64+'</file>\
									    </documents>\
			      					</mmJob>'
			          },
			          success: function(data, status, xhr) {
			          	$("#docUpload input[type=button]").hide();
			          	$('#uploadMsg').append(object.filename + " successfully uploaded.")
			          	pw.notifyChannelOfEvent("property_info");
	            		return false;
			          }
			    });  
			 	
			});
	
	};

}