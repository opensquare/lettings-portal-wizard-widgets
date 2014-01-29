function Widget_documents() {

	this.initExtend = function() {
        pw.addListenerToChannel(this, "property_info");
    }
	
	this.handleEvent = function(channel, event) {
        this.loadHTML();
    }

	this.onReadyExtend = function() {

			var searchTerm =  $(".tabs").attr("propertyuid");
			searchTerm = "Test"; //DEV -remove

			if(typeof searchTerm != 'undefined'){

				var getUrl = 'proxy/mailmerger/jobs/search/' + encodeURIComponent('%'+ searchTerm +'%');
				var noDocMsg = "No documents found for this policy."
			
				$.ajax(getUrl)
                    .done(function(searchResultsArray) {

					$('.mm-documents').append("<h4>Simply click on a document to view it's content...</h4>");

					if(searchResultsArray.length === 0 ){
						$('.mm-documents').append(noDocMsg);

					} else {
						$('.mm-documents').append("<div class='docContainer'></div>");
						for (var i = 0; i < searchResultsArray.length; i++) {	
						var descArray = (searchResultsArray[i].description).split('|');
						var template = (searchResultsArray[i].template  === undefined) ? "" : searchResultsArray[i].template + " - ";
						var userDesc = (descArray[2] == "Not supplied" || descArray[2] === undefined) ? "" : descArray[2] + " ";
						var $searchItemHtml = $('<a class="pdf" target="_blank" href=' + 'proxy/mailmerger/output/document/'+searchResultsArray[i].id+'/0' + '>'
								+ template + descArray[0] + " - " + userDesc + moment(new Date(searchResultsArray[i].date)).format("DD/MM/YYYY") + '</a>');
						$('.docContainer').append($searchItemHtml);
						}
					}
					
					})
                    .fail(function(){
						console.debug('Documents unavailable');
						$('.mm-documents').append("<p>Document service currently unavailable - documents relating to property would be displayed here</p>");
				});

			} 
	};

}