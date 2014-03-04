function Widget_display_step(){

    var 
        activeStep = {}
    ;
    this.activeStep;
    this.channelLoadStep = 'step.load';

    this.initExtend = function() {
        activeStep.name        = this.parameterMap.activeStep;
        activeStep.paramString = this.$widgetDiv.attr('params');
        pw.addListenerToChannel(this, this.channelLoadStep);
    }

    this.onReadyExtend = function() {
        this.mountStep();
    }

    this.handleEvent = function(channel, event) {
        if (pw.defined(event.uri) && pw.defined(event.entity)){
            this.parseAndLoadStep(event.uri, event.entity);
        }
    }

    this.parseAndLoadStep = function(uri, entity){
        var name,
            parameters
        ;
        name = uri.substring(0, uri.indexOf('?'));
        parameters = uri.substring(uri.indexOf('?') + 1);
        this.loadStep(name, entity, parameters);
    }

    this.loadStep = function(name, entity, parameters) {
        this.parameterMap.activeStep = name;
        this.parameterMap.entity     = entity;
        this.parameterMap.stepParams = parameters;
        this.loadHTML();
    }

    this.mountStep = function(){
       // need to mount widget manually - layout content is processed before {params} are substituted
       pw.mount($('.step-container div.widget', this.$widgetDiv).removeAttr('delayload'));
    }

}