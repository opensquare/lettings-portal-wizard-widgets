function Widget_portal_step_summary() {
    /*
        Requires initialisation of pw.portalChannels.setPageArgs
        Required for immediate load:
            - $widgetDiv data:
                - step-data {stepType}
        Required for delayed load via channel call
            - Widget Params:
                - stepType
        Optional:
            - Widget Params:
                - entity
    */

    this.displayType = '';

    this.initExtend = function() {
        // get page data from widget
        var stepData     = this.$widgetDiv.data('step-data');
        
        if(pw.defined(stepData)){
            // prepare request parameters
            this.displayType = stepData.stepType;
            this.setLoadParameters();
        }

        pw.addListenerToChannel(this, 'step.summary');

    }

    this.handleEvent = function(channel, event) {
        if(!event.hide){
            this.displayType = this.parameterMap.stepType;
            this.setLoadParameters();
            this.loadHTML();
        } else {
            this.setContent('');
        }
    }

    this.onReadyExtend = function(){
        this.addHandlers();
    }

    this.setLoadParameters = function() {
        // Needs updating when connecting to back end
        
        var contentMap = { // temporary mapping to xml file
            user:     'page-user-profile',
            property: 'page-property-progress',
            tenancy:  'page-tenancy-progress'
        },
        id = '';

        if (pw.defined(this.parameterMap.entity) && this.parameterMap.entity != '') {
            id = '-' + this.parameterMap.entity;
        }

        this.parameterMap.path = contentMap[this.displayType] + id; // name of xml file
    }

    this.addHandlers = function() {
        $('a.step-link', this.$widgetDiv).click(function(event){
            
            if ($(this).data('disabled')) {
                return false;
            }
            pw.notifyChannelOfEvent(pw.portalChannels.setPageArgs, {
                args : {step : $(this).data('step')},
                updateExisting : true
            });

            return false;
        });

    }
}