function Widget_display_step(){
    /**
        Responds to channel events to load a widget with optional widget parameters.
        load event notification objects take the form:
        {
            uri : 'widgetName?param1=value1&param2=value2', // required value
            entity : uid // value is appended to widget params as entity=uid. Optional
        }
    */
    this.channelLoadStep = 'step.load';

    this.initExtend = function() {
        // add listeners
        pw.addListenerToChannel(this, this.channelLoadStep);
    }

    this.onReadyExtend = function() {
        // mount contained widget
        this.mountStep();
    }

    this.handleEvent = function(channel, event) {
        // on request to load new page
        if (pw.defined(event.uri)){
            this.parseAndLoadStep(event);
        }
    }

    this.parseAndLoadStep = function(step){
        var 
            name       = step.uri.substring(0, step.uri.indexOf('?')),
            parameters = step.uri.substring(step.uri.indexOf('?') + 1)
        ;
        
        this.loadStep(name, step.entity, parameters);
    }

    this.loadStep = function(name, entity, parameters) {
        // update widget parameters
        this.parameterMap.activeStep = name;
        if (pw.defined(entity)){
            this.parameterMap.entity = entity;
        } else {
            this.parameterMap.entity = null;
        }
        this.parameterMap.stepParams = parameters;

        // reload widget
        this.loadHTML();
    }

    this.mountStep = function(){
       // need to mount widget manually - layout content is processed before {params} are substituted
       pw.mount($('.step-container div.widgettoload', this.$widgetDiv).removeClass('widgettoload').addClass('widget'));
    }

}