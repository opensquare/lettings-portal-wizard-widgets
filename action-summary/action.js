function Widget_action_summary(){

	var template ,
		pageType = ''

	this.propertyId = '';

	var widgetObject = this;

	this.onReadyExtend = function(){
		template = $('.action-container', this.$widgetDiv);
		pageType = this.$widgetDiv.data('page-type');
		this.propertyId = this.$widgetDiv.data('propid');
		this.loadAction();
	}

	this.loadAction = function(){
		$.ajax({
			url: 'widgets/action-summary/actions.json',
			dataType: 'json',
		})
		.done(populateAction)
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}


	function populateAction(data) {
		var actionTemplate = '<li class="list-group-item"><span class="glyphicon"></span></li>';
		$('.action-title', template).text(data.process.name)
		$('.action-subtext', template).text(data.process.subtext)
		var completed = 0;
		var actions = data.process.actions;
		var noOfActions = actions.length;

		for (var i = 0; i < noOfActions; i++) {
			var action = actions[i];
			var $actionTask = $(actionTemplate);
			var actionLink = '';
			var linkHref = '#' + pageType + '/' + action.portalWidget + '?' + action.params + '&p=' + widgetObject.propertyId;

			if (action.complete){
				completed++;
				actionLink = '&nbsp;<a class="text-success" href="' + linkHref + '">' + action.name + '</a>'
				$actionTask.addClass('list-group-item-success');
			} else {
				actionLink = '&nbsp;<a class="text-danger" href="' + linkHref + '">' + action.name + '</a>';
				$actionTask.addClass('list-group-item-danger');
			}

			$('.glyphicon', $actionTask)
			.addClass(action.complete ? 'glyphicon-ok':'glyphicon-remove')
			.after(actionLink);
			$('.action-list',template).append($actionTask);
		}

		var percentComplete = (completed / noOfActions) * 100;
		$('.action-total', template).text(completed + '/' + noOfActions);
		$('.progress-bar',template)
		.attr('aria-valuenow', Math.ceil(percentComplete))
		.css('width', Math.ceil(percentComplete) + '%')
		.find('.action-percent').text(percentComplete.toString().substr(0,4));
		
		if(noOfActions != completed) {
			$('.action-button', template).addClass('disabled').addClass('btn-default');
		} else {
			$('.action-button', template).addClass('btn-success')
		}
	}
}