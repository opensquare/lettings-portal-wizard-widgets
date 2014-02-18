function Widget_action_summary(){

    var widgetObject = this;

    var template,
        pageType = ''
    ;


    this.entityId = '';
    this.mimimise;


    this.onReadyExtend = function(){
        template = $('.action-container', this.$widgetDiv);

        pageType      = this.$widgetDiv.data('page-type');
        this.entityId = this.$widgetDiv.data('propid');
        this.minimise = this.$widgetDiv.data('minimise');

        this.loadAction();
    }

	this.loadAction = function(){
		$.ajax({
			url: 'widgets/action-summary/actions.json',
			dataType: 'json',
		})
		.done(function(data){
			for (var i = 0; i < data.length; i++) {
				activity = data[i];
				if (activity.entity == widgetObject.entityId){
					populateActionList(activity);
				}
			};
		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}

    function createCompletedStepItem(action, linkHref){
        var link = 
            '<li class="list-group-item list-group-item-success">'
        +       '<span class="glyphicon glyphicon-ok-circle"></span>'
        +       '&nbsp;<a class="text-success" href="' + linkHref + '">' + action.name + '</a>'
        +   '</li>';
        return link;
    }

    function createIncompleteStepItem(action, linkHref){
        var link = 
            '<li class="list-group-item list-group-item-default">'
        +       '<span class="glyphicon glyphicon-record"></span>'
        +       '&nbsp; <a class="text-primary" href="' + linkHref + '">' + action.name + '</a>'
        +   '</li>';
        return link;
    }

    function addMinifyFunctionality(template, completed) {
        var
            buttonHTML = '<button type="button" class="btn btn-link">'
            +    '<span class="btn-text"></span>'
            +    '</button>',
            $button     = $(buttonHTML),
            $stepText   = $('p.action-progress', template),
            $subText    = $('.action-subtext', template),
            $actionList = $('.action-group', template)
        ;

        $('.btn-text', $button).html($stepText.html());

        $button.click(function(event) {
            $actionList.slideToggle();
        });

        $subText.after($button);
        $stepText.remove();
        
        $actionList.hide();

    }

    function populateActionList(data) {
        var 
            actionTemplate = '<li class="list-group-item"><span class="glyphicon"></span></li>',
            completed = 0,
            actions = data.process.actions,
            noOfActions = actions.length
        ;

        // set main text
        $('.action-title', template).text(data.process.name)
        $('.action-subtext', template).text(data.process.subtext)

        // build steps list
        for (var i = 0; i < noOfActions; i++) {
            var 
                action      = actions[i],
                $actionTask = $(actionTemplate),
                actionLink  = '',
                linkHref    = '#' + pageType + '/' + action.portalWidget + '?' + action.params + '&p=' + widgetObject.entityId;

            if (action.complete){
                completed++;
                actionLink = createCompletedStepItem(action, linkHref);
            } else {
                actionLink = createIncompleteStepItem(action, linkHref);
            }
            $('.action-list',template).append(actionLink);
        }

		if (noOfActions !== 0){
			updateProgress(template, completed, noOfActions);
		} else {
			$('.action-progress',template).remove();
		}
		if (widgetObject.minimise) {
			$('.action-progress.progress', template).remove();
			addMinifyFunctionality(template, noOfActions === completed);
		}
		updateActionButton(action, noOfActions, completed, data.process.toActionOn, template);
	}

	function updateActionButton(action, noOfActions, completed, actionOnComplete, template) {
		if (!actionOnComplete || noOfActions == 0){
			$('.action-button', template).remove();
		} else if (completed != noOfActions){
			$('.action-button', template).addClass('disabled').addClass('btn-default');
		} else if (noOfActions > 0){
			$('.action-button', template).addClass('btn-success')
			// todo add click handler
		}
	}

	function updateProgress(template, completed, noOfActions){
		var percentComplete = (completed / noOfActions) * 100;
		$('.action-total', template).text(completed + '/' + noOfActions);
		$('.progress-bar',template)
		.attr('aria-valuenow', Math.ceil(percentComplete))
		.css('width', Math.ceil(percentComplete) + '%')
		.find('.action-percent').text(percentComplete.toString().substr(0,4));
	}

}