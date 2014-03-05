function Widget_portal_steps(){

    this.failedToLoad = false;
    this.defaultUrl   = 'widgets/portal-steps/response.xml';
    this.channelLoadStep = 'step.load';

    // loads file using responsePath parameter
    this.initExtend = function() {
        var 
            responsePath = this.parameterMap.responsePath,
            entity = this.parameterMap.entity,
            path = this.parameterMap.path
        ;
        // if responsePath isn't set but entity and path is, form responsePath and add to parameter map
        if (!pw.defined(responsePath) && pw.defined(entity) && pw.defined(path)){
            this.parameterMap.responsePath = 'widgets/' + path + '/entity-' + entity + '.xml';
        } else if (!pw.defined(responsePath)){
            this.parameterMap.responsePath = this.defaultUrl;
        }
    }

	this.onReadyExtend = function() {

        this.resizeSteps();

        // add tick to completed steps
        $('.steps li.complete h3').prepend('<span class="glyphicon glyphicon-ok"></span> ');

        // add cross to incomplete steps
        $('.steps li.incomplete h3').prepend('<span class="glyphicon glyphicon-remove"></span> ');

        // add back to back step
        $('.steps li.step-back h3').prepend('<span class="glyphicon glyphicon-chevron-left"></span> ');

        // add click handler to steps
        this.addHandlers();

        // load the active step widget (httpResponse widgets aren't native layout types)
        pw.mount(
            $('.step-content div.widget', this.$widgetDiv)
            .removeAttr('delayLoad')
        );
    }

    this.addHandlers = function() {
        var widgetObject = this;
        $('a.step-link', this.$widgetDiv).click(function(){
            $(this).parents('.steps').children().removeClass('active');
            $(this).parent().addClass('active');
            pw.notifyChannelOfEvent(widgetObject.channelLoadStep, {
                uri   : $(this).attr('href'),
                entity : widgetObject.parameterMap.entity
            });
            return false;
        })
    }

    this.onLoadFailure = function() {
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

    this.resizeSteps = function(){
        // count number of steps 
            /*var countChildElem = document.getElementsByClassName('steps')[0].childElementCount;*/
        // use jquery to avoid dom errors on widget load fail
        var countChildElem = $('.steps', this.$widgetDiv).eq(0).children().size();

        // divide window width with number of steps
            /* var windowWidth = window.innerWidth; */
        // use widget container width
        var windowWidth = $('.widget-content' ,this.$widgetDiv).width() - 35; // make allowance for scroll bar

        // get width of back step
        var backWidth = windowWidth/countChildElem/2;

        // get step width
        var stepWidth = (windowWidth - backWidth) / (countChildElem - 1);

        // make each li width window width divided by number of steps (excluding back step)
        $('.steps li').css('width', stepWidth + 'px');

        // make back step half width
        $('.steps li.step-back').css('width', backWidth + 'px');

    }

}