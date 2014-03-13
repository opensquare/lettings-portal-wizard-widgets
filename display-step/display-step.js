function Widget_display_step(){
    /**
        Responds to channel events to load a widget with optional widget parameters.
        load event notification objects take the form:
        {
            uri : 'widgetName?param1=value1&param2=value2', // required value
            entity : uid // value is appended to widget params as entity=uid. The property must be defined but value is dependant on widget requirements
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
        if (pw.defined(event.uri) && pw.defined(event.entity)){
            this.parseAndLoadStep(event.uri, event.entity);
        }
    }

    this.parseAndLoadStep = function(uri, entity){
        var 
            name       = uri.substring(0, uri.indexOf('?')),
            parameters = uri.substring(uri.indexOf('?') + 1)
        ;
        
        this.loadStep(name, entity, parameters);
    }

    this.loadStep = function(name, entity, parameters) {
        // update widget parameters
        this.parameterMap.activeStep = name;
        this.parameterMap.entity     = entity;
        this.parameterMap.stepParams = parameters;

        // reload widget
        this.loadHTML();
    }

    this.mountStep = function(){
       // need to mount widget manually - layout content is processed before {params} are substituted
       pw.mount($('.step-container div.widget', this.$widgetDiv).removeAttr('delayload'));
    }

}