function Widget_portal_steps(){

    /**
    *   Widget can prompt users before unloading widget, by default this is turned off. To enable/disable at any point from the loaded widget, 
    *   send a channel notification in the following format, replacing loadedWidgetName with the name of the loaded widget:
    *   pw.notifyChannelOfEvent('loadedWidgetName.unloadPrompt', {enabled: true}) // pass false to disable
    *   Remember to disable again when appropriate
    */

    var
        updatePromptChannel,
        stepSwitcher,
        unloadChannel,
        _this = this
    ;

    this.prepareParams = function(display, pageData) {
        // forms name of xml file to display. Needs updating when connecting to back end
        
        var contentMap = {
            user:     'page-user-profile',
            property: 'page-property-progress',
            tenancy:  'page-tenancy-progress'
        },
        id = pw.defined(pageData.identifier) ? '-' + pageData.identifier : '';

        this.parameterMap.path = contentMap[display] + id;

        if(pw.defined(pageData.arguments.step)) {
            this.parameterMap.step = pageData.step;
        }
    }

    this.initExtend = function() {
        // get page data from widget
        var 
            displayType = this.$widgetDiv.data('display'),
            pageData    = this.$widgetDiv.data('page-data');
        
        // prepare request parameters
        this.prepareParams(displayType, pageData);

        // prepare listeners
        unloadChannel = this.name + '.unloadResult'
        pw.addListenerToChannel(this, unloadChannel);

        // initialise step change controller
        if (typeof pageData.portalChannels == 'object'){
            stepSwitcher = new StepSwitcher();
            stepSwitcher.init(unloadChannel, pageData.portalChannels);
        }
    }

	this.onReadyExtend = function() {

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
            var changing;
            
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
    function StepSwitcher() {
        var 
            channels = {
                load : 'step.load',
                preventHashChange : 'portal.preventPageLoad',
                stepUnload : '',
                hashResponseChannel : '',
                portalChannels : {}
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
            if (pw.defined(channels.portalChannels.setPageArgs)){
                pw.notifyChannelOfEvent(channels.portalChannels.setPageArgs, {
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

        function init(hashResponseChannel, portalChannels){
            channels.hashResponseChannel = hashResponseChannel;
            channels.portalChannels = portalChannels;
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