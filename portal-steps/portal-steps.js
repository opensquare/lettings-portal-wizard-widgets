function Widget_portal_steps(){

    /**
    *   Widget can prompt users before unloading widget, by default this is turned off. To enable/disable at any point from the loaded widget, 
    *   send a channel notification in the following format:
    *   pw.notifyChannelOfEvent('step.promptOnUnload', {enabled: true}) // pass false to disable
    *   Remember to disable again when appropriate
    */

    this.displayType    = ''; // determines what set of steps to load
    this.portalChannels = {}; // channels used to send notifications to container
    this.promptEnabled = false; // whether to prompt user before changing step

    var _this = this,
        confirmText = 'You are about to navigate away from the current step. Any changes you have made may be lost.',
        publish = {
            changeStep: 'step.load',
            summary: 'step.summary'
        },
        listen = {
            unload: '', // channel listening for result of user prompt
            changePrompt: 'step.promptOnUnload'
        }
    ;

    /*
        Before loading html
    */

    this.initExtend = function() {
        // get page data from widget
        var pageData     = this.$widgetDiv.data('page-data');
        this.displayType = this.$widgetDiv.data('display');
        
        // prepare request parameters
        this.setLoadParameters(pageData);

        // prepare listeners
        listen.unload = this.name + '.unloadResult'
        pw.addListenerToChannel(this, listen.unload);
        pw.addListenerToChannel(this, listen.changePrompt);

        this.portalChannels = pageData.portalChannels;

        if (!pw.defined(this.portalChannels.promptOnPageChange)){
            publish.promptUpdated = this.portalChannels.promptOnPageChange;
        } else {
            publish.promptUpdated = 'portal.preventPageLoad';
        }

    }

    this.setLoadParameters = function(pageData) {
        // Needs updating when connecting to back end
        
        var contentMap = { // temporary mapping to xml file
            user:     'page-user-profile',
            property: 'page-property-progress',
            tenancy:  'page-tenancy-progress'
        },
        id = '';

        if (pw.defined(pageData.identifier)) {
            id = '-' + pageData.identifier;
            this.parameterMap.entity = pageData.identifier;
        }

        this.parameterMap.path = contentMap[this.displayType] + id; // name of xml file

        if(pw.defined(pageData.arguments.step)) {
            this.parameterMap.step = pageData.arguments.step; // set which step to display
        }
    }

    /*
        When ready to display
    */

    this.onReadyExtend = function() {
        var $link = $('.steps li.active a', this.$widgetDiv);

        // format disabled steps
        $('a.step-link[data-disabled=true]', this.$widgetDiv).addClass('disabled');
        
        if (!pw.defined(this.parameterMap.step)){
            this.updateUrl($link); // update query parameters if step not set to reflect step displayed
        }

        this.updateUnloadHandler();

        // add link handlers
        this.addHandlers();
    }
    
    this.updateUrl = function($link){
        var number = $link.data('step');
        if (pw.defined(this.portalChannels.setPageArgs)){
            pw.notifyChannelOfEvent(this.portalChannels.setPageArgs, {
                args : {step : number},
                updateExisting : true,
                reloadPage : false
            })
        } else {
            console.error('Unable to update step parameter, change argument channel has not been supplied');
        }
    }

    this.addHandlers = function() {
        $('a.step-link', this.$widgetDiv).click(function(){
            
            if ($(this).data('disabled')) {
                return false;
            }
            if(_this.requestChangeStep($(this))){
                // step changing, update display
                $(this).parents('.steps').children().removeClass('active');
                $(this).parent().addClass('active');
                _this.setNewStep($(this));
            }

            return false;
        });

    }

    /*
        On interaction with widget
    */
    this.handleEvent = function(channel, event) {
        if (channel == listen.changePrompt && pw.defined(event.enabled)) {
            // update to enable/disable prompt
            this.updatePromptHandler(event.enabled);
        } else if(channel == listen.unload && event === true) {
            // portal unloading widget. Clean up listeners and handlers
            this.widgetUnloading();
        }
    }

    this.requestChangeStep = function($link) {
        if (!this.promptEnabled || window.confirm(confirmText)) {

            this.updatePromptHandler(false);

            pw.notifyChannelOfEvent(publish.changeStep, {
                uri : $link.attr('href'),
                entity : this.parameterMap.entity
            });
            pw.notifyChannelOfEvent(publish.summary, {
                hide: true
            });
            return true;
        }
        return false;
    }

    this.setNewStep = function($link){
        $('.breadcrumb li.active', this.$widgetDiv).text($link.text().trim());
        this.updateUrl($link);
    }

    this.widgetUnloading = function() {
        this.updatePromptHandler(false);
        pw.removeListenersFromChannel(listen.changePrompt);
        pw.removeListenersFromChannel(listen.unload);
    }

    /*
        Prompt handlers
    */
    this.publishPromptStatus = function() {
        pw.notifyChannelOfEvent(publish.promptUpdated, {
            preventLoad: this.promptEnabled,
            message: confirmText,
            responseChannel: listen.unload
        });
    }

    this.updatePromptHandler = function(enabled) {
        if (this.promptEnabled !== enabled) {
            this.promptEnabled = enabled ? true : false;
            this.publishPromptStatus();
            this.updateUnloadHandler();
        }
    }

    this.updateUnloadHandler = function() {
        if (this.promptEnabled) {
            window.onbeforeunload = function(){
                return confirmText;
            };
        } else {
            window.onbeforeunload = null;
        }
    }
}