function Widget_action_summary(){
    /**
    * currently utilizes two json files to load action progress for an entity
    * requires set-type and entity data attributes on widget container to load
    * correctly
    * In real use idea will be to make a single call passing in entity and 'list' identifiers
    * to return all data at once
    */
    var 
        widgetObject = this,
        template
    ;

    this.entityId = '';
    this.setId;
    this.actionSet;
    this.mimimise;
    this.pageType;


    this.onReadyExtend = function(){
        template = $('.action-container', this.$widgetDiv);

        this.entityId = this.$widgetDiv.data('entity');    // what entity to load progress for. Required
        this.pageType = this.$widgetDiv.data('set-type');  // for links and entity action set to use. Required
        this.setId    = this.$widgetDiv.data('set-id');    // what progress set to use. Optional
        this.minimise = this.$widgetDiv.data('minimise');  // minimal collapsible display version. Optional

        this.loadAction(this.pageType);
    }

    function findInArray(array, identifier, value){
        for (var i = 0; i < array.length; i++) {
            if (array[i][identifier] == value){
                return array[i];
            }
        };
        return null;
    }

    this.loadAction = function(loadSet){
        // load generic action list first
        $.ajax({
            url: 'widgets/action-summary/action-set.json',
            dataType: 'json',
        })
        .done(function(data){
            widgetObject.actionSet = findInArray(data, "type", loadSet);

            if (widgetObject.actionSet !== null) {
                widgetObject.loadActionProgress();
            } else {
                widgetObject.setContent('Actions for entity type not found');
            }

        })
        .fail(function(object, status, error){
            console.debug('error: ' + status + ' msg: ' + error);
        });
    }

    this.loadActionProgress = function(){
        $.ajax({
            url: 'widgets/action-summary/actions.json',
            dataType: 'json',
        })
        .done(function(data){
            var 
                entityProgress = findInArray(data, "entity", widgetObject.entityId),
                progressList
            ;

            if (entityProgress !== null && pw.defined(widgetObject.setId)) {
                // get progress list as defined by set to use, may not be present
                progressList = findInArray(entityProgress.actions, "id", widgetObject.setId);
            } else if (entityProgress !== null) {
                // get first available incomplete or empty progress list
                progressList = getIncompleteList(entityProgress);
            } else {
                this.setContent('actions not found for entity');
                return;
            }

            widgetObject.populateActionList(progressList);
        })
        .fail(function(object, status, error){
            console.debug('error: ' + status + ' msg: ' + error);
        });
    }

    function getIncompleteList(lists){
        var list,
            incompleteStep,
            blanklist
        ;
        for (var i = 0; i < lists.actions.length; i++){
            incompleteStep = findInArray(lists.actions[i].steps, "complete", false);
            if (incompleteStep != null){
                list = lists.actions[i];
                break;
            }
            if (lists.actions[i].steps.length == 0){
                blanklist = lists.actions[i];
            }
        }
        return list == null ? blanklist : list;

    }

    function createCompletedStepItem(step, linkHref){
        var link = 
            '<li class="list-group-item list-group-item-default">'
        +       '<a class="text-success" href="' + linkHref + '">'
        +       '<span class="glyphicon glyphicon-ok-circle"></span> ' + step.name + '</a>'
        +   '</li>';
        return link;
    }

    function createIncompleteStepItem(step, linkHref){
        var link = 
            '<li class="list-group-item list-group-item-default">'
        +       '<span class="glyphicon glyphicon-record"></span>'
        +       '&nbsp; <a class="text-primary" href="' + linkHref + '">' + step.name + '</a>'
        +   '</li>';
        return link;
    }

    function createDisabledStepItem(step){
        var link = 
            '<li class="list-group-item list-group-item-default">'
        +       '<span class="glyphicon glyphicon-remove-circle"></span>'
        +       '&nbsp; <span class="text-muted">' + step.name + '</span>'
        +   '</li>';
        return link;
    }

    function addMinifyFunctionality(template, completed) {
        var
            buttonHTML = '<a class="btn btn-link" role="button">'
            +    '<span class="btn-text"></span>'
            +    '</a>',
            $button     = $(buttonHTML),
            $stepText   = $('p.action-progress', template),
            $title      = $('.action-title', template),
            $actionList = $('.action-group', template)
        ;

        $('.btn-text', $button).html($stepText.html());

        $button.click(function(event) {
            $actionList.slideToggle();
        });

        $title.after($button);
        $stepText.remove();
        
        $actionList.hide();

    }

    this.populateActionList = function(progressList) {
        var 
            stepList,       // list of steps to display
            completed = 0,  // no of completed steps in list
            disabled = 0,   // no of disabled steps in list
            noOfSteps,      // total no of steps in list
            // during iteration of steps
            currentStep,    // the current step in use
            progressStep,   // completion state of step
            stepLink,       // link to be appened to list
            linkHref        // href of link to be appended
        ;
        

        if (progressList !== null){
            // using a specific progress list
            stepList = findInArray(this.actionSet.actions, "id", progressList.id);
        } else {
            // using specific list, regardless of progress
            stepList = findInArray(this.actionSet.actions, "id", this.setId);
        }

        // set main text
        $('.action-title', template).text(stepList.action);
        $('.action-title', template).before('<span class="glyphicon glyphicon-' + stepList.icon + '"></span>&nbsp;');
        $('.action-subtext', template).text(stepList.description);

        noOfSteps = stepList.steps.length;
        for (var i = 0; i < noOfSteps; i++) {
            // reset variables
            currentStep  = stepList.steps[i];
            progressStep = (progressList == null) ? null : findInArray(progressList.steps, "name", currentStep.name);
            stepLink = '';
            linkHref = '#' + this.pageType + '/' + currentStep.widget + '?' + this.entityId;

            // set step completion
            currentStep.complete = (progressStep !== null) ? progressStep.complete : 'disabled';

            // build steps list
            if (currentStep.complete === true){
                completed++;
                stepLink = createCompletedStepItem(currentStep, linkHref);
            } else if (currentStep.complete === 'disabled'){
                disabled++;
                stepLink = createDisabledStepItem(currentStep);
            } else {
                stepLink = createIncompleteStepItem(currentStep, linkHref);
            }
            $('.action-list',template).append(stepLink);

        };

        if (noOfSteps !== 0){
            // update progress bar / step count
            updateProgress(template, completed, noOfSteps);
        } else {
            // remove progress bar / step count
            $('.action-progress',template).remove();
        }
        if (progressList == null){
            // current list cannot be actioned on
            template.addClass('text-muted');
        }
        if (widgetObject.minimise) {
            $('.action-progress.progress', template).remove();
            addMinifyFunctionality(template, noOfSteps === completed);
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