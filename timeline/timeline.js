function Widget_timeline() {

	this.initExtend = function() {
        pw.addListenerToChannel(this, "property_info");
    }
	
	this.handleEvent = function(channel, event) {
       this.loadHTML();
    }

	this.onReadyExtend = function() {
		var timeline_data = [];
		// key should be passed to widget directly
		var key = $(".widget.ll-tenancy-activity").attr("page.args");

		if(typeof key != 'undefined'){

			//Parse notes
		$.ajax({type:"GET",url:'proxy/scribe/notes?key='+key}).done(function(notesArray){
			
			$(notesArray).each(function(){

						creationTime = this.creationTime.replace('BST', 'GMT');// moment.js issue - cannot pass BST timezone

						timeline_data.push({
					        type:     'blog_post',
					        date:     moment(creationTime).format('YYYY-MM-DD'),
					        title:    "GROUP: " + this.group + ", KEY: " + this.key,
					        width:   350,
					        content:  '<div>EFFECTIVE: ' + moment(creationTime).format("MMMM Do YYYY, h:mm:ss a") + '<br/><br/>' + this.message + '</div>'
				    	});
					});
			
					// Timeline
				    var options = {
				        animation:   true,
				        lightbox:    true,
				        showYear:    true,
				        allowDelete: false,
				        columnMode:  'dual'
				    };

				    var timeline = new Timeline($('#timeline'), timeline_data);
				    timeline.setOptions(options);
				    timeline.display();

					
				}).fail(function() { 
					$("#timeline").append("<p>Timeline showing tenancy events will display here (currently unavailable)</p>");
					console.debug("Property Timeline unavailable");
			 	});
			}

		}
		
		
}