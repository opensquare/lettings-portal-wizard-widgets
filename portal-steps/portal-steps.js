function Widget_portal_steps(){

    /**
    *   -   Description in breadcrumb is assigned by adding data-description attribute to widget div before load
    *       or set to 'progress' by default
    */

    this.failedToLoad = false;
    this.defaultUrl   = 'portal-steps-response';
    this.channelLoadStep = 'step.load';
    this.stepDescription = '';
    this.breadcrumbPlaceholder = '{pageDescription}';

    // loads file using responsePath parameter
    this.initExtend = function() {
        var 
            responsePath = this.parameterMap.responsePath,
            entity = this.parameterMap.entity,
            path = this.parameterMap.path,
            stepDescription
        ;
        // if responsePath isn't set but entity and path is, form responsePath and add to parameter map
        if (!pw.defined(responsePath) && pw.defined(entity) && pw.defined(path)){
            this.parameterMap.responsePath = path + '-' + entity;
        } else if (!pw.defined(responsePath)){
            this.parameterMap.responsePath = this.defaultUrl;
        }
        // get breadcrumb description text
        stepDescription      = this.$widgetDiv.data('description');
        this.stepDescription = pw.defined(stepDescription) ? stepDescription : 'progress';
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

        // replace breadcrumb placeholder
        var crumbText = $('.breadcrumb li.active', this.$widgetDiv).text();
        $('.breadcrumb li.active', this.$widgetDiv).text(crumbText.replace(this.breadcrumbPlaceholder, this.stepDescription));

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
        });
        
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

        // get step width
        var stepWidth = windowWidth / countChildElem;

        // make each li width window width divided by number of steps 
        $('.steps li').css('width', stepWidth + 'px');

    }

}