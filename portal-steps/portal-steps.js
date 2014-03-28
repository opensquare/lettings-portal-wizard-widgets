function Widget_portal_steps(){

    /**
    *   Widget can prompt users before unloading widget, by default this is turned off. To enable/disable at any point from the loaded widget, 
    *   send a channel notification in the following format, replacing loadedWidgetName with the name of the loaded widget:
    *   pw.notifyChannelOfEvent('loadedWidgetName.unloadPrompt', {enabled: true}) // pass false to disable
    *   Remember to disable again when appropriate
    */

    this.failedToLoad          = false;
    this.defaultUrl            = 'portal-steps-response';
    this.stepDescription;

    var
        updatePromptChannel,
        stepSwitcher,
        unloadChannel,
        _this = this
    ;

    // currently loads file from widgets/xmldata/{responsePath}.xml 
    this.initExtend = function() {
        var 
            responsePath = this.parameterMap.responsePath,
            entity       = this.parameterMap.entity,
            path         = this.parameterMap.path
        ;

        // if responsePath isn't set but entity and path is, form responsePath and add to parameter map
        if (!pw.defined(responsePath) && pw.defined(entity) && pw.defined(path)){
            this.parameterMap.responsePath = path + '-' + entity;
        } else if (!pw.defined(responsePath)){
            this.parameterMap.responsePath = this.defaultUrl;
        }

        // add listener for impending widget unload via hash change
        unloadChannel = this.name + '.unloadResult'
        pw.addListenerToChannel(this, unloadChannel);

        // initialise step change handler
        stepSwitcher = new StepSwitcher;
        stepSwitcher.init(unloadChannel, this.$widgetDiv.data('ch-page-args'));
    }

	this.onReadyExtend = function() {
        // add icons and resize step panels
        //this.formatSteps();

        // add click handler to steps
        this.addHandlers();

        // format disabled steps
        $('a.step-link[data-disabled=true]', this.$widgetDiv).addClass('disabled');

        // get step to be loaded and add prompt listener
        var currentStep = $('li.active a').attr('href');
        currentStep = currentStep.substring(0, currentStep.indexOf('?'));
        updatePromptChannel = stepSwitcher.setFirstStep(currentStep, $('li.active a').data('step'));

        pw.addListenerToChannel(this, updatePromptChannel);

        // replace breadcrumb placeholder
        this.updatebreadCrumb($('li.active a', this.$widgetDiv).text().trim());


    }

    this.addHandlers = function() {
        $('a.step-link', this.$widgetDiv).click(function(){
            var 
                changing
            ;
            
            if ($(this).data('disabled')) {
                return false;
            } else {
                // send request to change step, which prompts first if neceesary
                changing = stepSwitcher.changeStep(
                    $(this).data('step'),
                    $(this).attr('href'),
                    _this.parameterMap.entity,
                    onBeforeStepChange
                )
            }

            if (changing){
                $(this).parents('.steps').children().removeClass('active');
                $(this).parent().addClass('active');
                _this.updatebreadCrumb($(this).text().trim());
            }

            return false;
        });
    }

    this.updatebreadCrumb = function(description) {
        $('.breadcrumb li.active', this.$widgetDiv).text(description);
    }

    function onBeforeStepChange(newPromptChannel) {
        // swap prompt listener to new step name
        pw.removeListenersFromChannel(updatePromptChannel);
        updatePromptChannel = newPromptChannel;
        pw.addListenerToChannel(_this, updatePromptChannel);
    }

    this.onLoadFailure = function() {
        // when plugged into ESB should display an error message, not load generic page
        var failedUrl = this.parameterMap.responsePath;
        console.debug('failed to load ' + failedUrl);
        // guard against recursion
        if (!this.failedToLoad){
            this.failedToLoad = true;
            this.loadGenericResponse();
            this.addMessage('data file ' + failedUrl + ' not available. Displaying generic step page');
        } else {
            this.clearMessages();
            this.setContent('Unable to load entity response data, ');
        }
    }

    this.loadGenericResponse = function() {
        this.parameterMap.responsePath = this.defaultUrl;
        this.loadHTML();
    }

    this.formatSteps = function(){
        // add tick to completed steps
        $('.steps li.complete h3').prepend('<span class="glyphicon glyphicon-ok"></span> ');

        // add cross to incomplete steps
        $('.steps li.incomplete h3').prepend('<span class="glyphicon glyphicon-remove"></span> ');

        // count number of steps 
        var countChildElem = $('.steps', this.$widgetDiv).eq(0).children().size();

        // divide widget width with number of steps
        var windowWidth = $('.widget-content' ,this.$widgetDiv).width() - 35; // make allowance for scroll bar

        // get step width
        var stepWidth = windowWidth / countChildElem;

        // make each li width window width divided by number of steps 
        $('.steps li').css('width', Math.floor(stepWidth) + 'px');

    }

    this.handleEvent = function(channel, event){
        if (channel == updatePromptChannel && pw.defined(event.enabled)) {
            // update to enable/disable prompt
            stepSwitcher.setPromptOnChange(event.enabled);
        } else if(channel == unloadChannel && event) {
            // portal unloading widget. Clean up listeners and handlers
            stepSwitcher.beforeUnload(true);
        }
    }

    // keep step handling functionality separate
    function StepSwitcher(hashResponseChannel) {
        var 
            channels = {
                load : 'step.load',
                preventHashChange : 'portal.preventPageLoad',
                stepUnload : '',
                hashResponseChannel : '',
                changeArgs : ''
            },
            promptOnChange = false,
            confirmText = 'You are about to navigate away from the current step. Any changes you have made may be lost.'
        ;

        function setOnUnloadHandler() {
            if (promptOnChange) {
                window.onbeforeunload = function(){
                    return confirmText;
                };
            } else {
                window.onbeforeunload = null;
            }
        }

        function setStepPromptChannel(name){
            channels.stepUnload = name + '.unloadPrompt';
        }

        function publishPreventHashChange(){
            /*  Inform listeners on whether to prompt before unloading,
                what message to use and where to publish the result.
            */ 
            pw.notifyChannelOfEvent(channels.preventHashChange, {
                preventLoad: promptOnChange,
                message : confirmText,
                responseChannel : channels.hashResponseChannel
            });
        }

        function updateStepPageArg(number){
            if (pw.defined(channels.changeArgs)){
                pw.notifyChannelOfEvent(channels.changeArgs, {
                    args : {
                        step : number,
                    },
                    updateExisting : true,
                    reloadPage : false
                })
            } else {
                console.error('Unable to update step parameter, change argument channel has not been supplied');
            }
        }

        function setPromptOnChange(prompt) {
            // update whether prompt is required
            if(promptOnChange !== prompt){
                promptOnChange = prompt === true ? true : false;
                // prompt has changed. Inform rest of portal of change
                publishPreventHashChange();
                setOnUnloadHandler();
            }
        }

        function setFirstStep(name, stepNo) {
            // initialise step channel without requesting load
            setStepPromptChannel(name);
            setOnUnloadHandler();
            updateStepPageArg(stepNo);
            publishPreventHashChange();
            return channels.stepUnload;
        }

        function changeStep(stepNo, uri, uid, beforeStepChange) {
            // confirm when required to change step, and if so, send request to change step
            var newStep;
            if (!(promptOnChange && !window.confirm(confirmText))) {
                newStep = uri.substring(0, uri.indexOf('?'));
                
                beforeUnload();
                setStepPromptChannel(newStep);
                beforeStepChange(channels.stepUnload);

                pw.notifyChannelOfEvent(channels.load, {
                    uri    : uri,
                    entity : uid
                });
                updateStepPageArg(stepNo);

                return true;
            }
            return false;
        }

        // step is about to change or portal is unloading widget
        function beforeUnload(hashUnload) {
            setPromptOnChange(false);
            if (channels.stepUnload !== ''){
                pw.removeListenersFromChannel(channels.stepUnload);
            }
            setOnUnloadHandler();
            if(hashUnload){
                pw.removeListenersFromChannel(channels.hashResponseChannel);
            }
        }

        function init(hashResponseChannel, changeArgsChannel){
            channels.hashResponseChannel = hashResponseChannel;
            channels.changeArgs = changeArgsChannel;
        }

        // expose public functions
        return {
            init : init,
            setFirstStep : setFirstStep,
            setPromptOnChange : setPromptOnChange,
            changeStep : changeStep,
            beforeUnload : beforeUnload
        };
    }
}