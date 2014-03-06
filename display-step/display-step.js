function Widget_display_step(){
    /**
        Responds to channel events to load a widget with optional widget parameters.
        load event notification objects take the form:
        {
            uri : 'widgetName?param1=value1&param2=value2', // required value
            entity : uid // value is appended to widget params as entity=uid. The property must be defined but value is dependant on widget requirements
        }

        Widget can prompt users before unloading widget, by default this is turned off. To enable/disable at any point from the loaded widget, 
        send a channel notification in the following format, replacing loadedWidgetName with the name of the loaded widget:
        pw.notifyChannelOfEvent('loadedWidgetName.unloadPrompt', {enabled: true}) // pass false to disable
        remember to disable again when complete
    */

    var 
        activeStep = {},
        channelPreventHashUnload = 'portal.preventPageLoad',
        channelHashUnloadResult = '.unloadResult',
        _this = this
    ;

    this.channelLoadStep = 'step.load';
    this.promptBeforeUnload = false;
    this.confirmationText = 'You are about to navigate away from the current step. Any changes you have made may be lost.';

    this.initExtend = function() {
        // assign initial active step
        activeStep.name          = this.parameterMap.activeStep;
        activeStep.paramString   = this.$widgetDiv.attr('params');
        activeStep.unloadChannel = activeStep.name + '.unloadPrompt';

        channelHashUnloadResult = this.name + channelHashUnloadResult;
        // clear previous listeners
        pw.removeListenersFromChannel(this.channelLoadStep);

        // add new listeners
        pw.addListenerToChannel(this, this.channelLoadStep);
        pw.addListenerToChannel(this, activeStep.unloadChannel);
        pw.addListenerToChannel(this, channelHashUnloadResult);
        this.updateUnloadHandlers(true);
    }

    this.onReadyExtend = function() {
        // mount contained widget
        this.mountStep();
    }

    this.handleEvent = function(channel, event) {
        if (channel == this.channelLoadStep){
            // on request to load new page
            if (pw.defined(event.uri) && pw.defined(event.entity)){
                this.parseAndLoadStep(event.uri, event.entity);
            }
        } else if (channel == activeStep.unloadChannel && pw.defined(event.enabled)) {
            // update need to prompt before unloading widget
            this.promptBeforeUnload = event.enabled ? true : false;
            this.updateUnloadHandlers(true);
        } else if (channel == channelHashUnloadResult) {
            // on result of confirmation to leave after hash change
            this.updateUnloadHandlers(false, event);
        }
    }

    this.parseAndLoadStep = function(uri, entity){
        var name,
            parameters
        ;
        if (!(this.promptBeforeUnload && !this.confirmUnload(true))) {
            name = uri.substring(0, uri.indexOf('?'));
            parameters = uri.substring(uri.indexOf('?') + 1);
            this.loadStep(name, entity, parameters);
        }
    }

    this.loadStep = function(name, entity, parameters) {
        // update widget parameters
        this.parameterMap.activeStep = name;
        this.parameterMap.entity     = entity;
        this.parameterMap.stepParams = parameters;
        
        // update activeStep object
        activeStep.name        = name;
        activeStep.paramString = parameters;

        // update unload listeners
        pw.removeListenersFromChannel(activeStep.unloadChannel);
        activeStep.unloadChannel = name + '.unloadPrompt';
        pw.addListenerToChannel(this, activeStep.unloadChannel);

        // update unload handler
        this.updateOnUnload();

        // reload widget
        this.loadHTML();
    }

    this.mountStep = function(){
       // need to mount widget manually - layout content is processed before {params} are substituted
       pw.mount($('.step-container div.widget', this.$widgetDiv).removeAttr('delayload'));
    }

    this.confirmUnload = function(widgetUnload) {
        return confirm(this.confirmationText);
    }

    this.updateOnUnload = function() {
        if (this.promptBeforeUnload) {
            window.onbeforeunload = function() {
                return _this.confirmationText;
            }
        } else {
            window.onbeforeunload = null;
        }
    }

    this.updateUnloadHandlers = function(notifyOfPrevent, unloading) {
        if (unloading) {
            // page is unloading so remove handlers
            this.promptBeforeUnload = false;
            notifyOfPrevent = true;
            // remove listeners
            pw.removeListenersFromChannel(activeStep.unloadChannel);
            pw.removeListenersFromChannel(channelHashUnloadResult);
        }
        // update window unload handler
        this.updateOnUnload();
        if (notifyOfPrevent) {
            // publish updated request to prompt on hash change
            pw.notifyChannelOfEvent(channelPreventHashUnload, {preventLoad: this.promptBeforeUnload, message : this.confirmationText, responseChannel:channelHashUnloadResult});
        }
    }

}