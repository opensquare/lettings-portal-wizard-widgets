function Widget_portal_steps(){

    this.failedToLoad = false;
    this.defaultUrl   = 'widgets/portal-steps/response.xml';

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

        // count number of steps 
            /*var countChildElem = document.getElementsByClassName('steps')[0].childElementCount;*/
        // use jquery to avoid dom errors on widget load fail
        var countChildElem = $('.steps', this.$widgetDiv).eq(0).children().size();

        // divide window width with number of steps
            /* var windowWidth = window.innerWidth; */
        // use widget container width
        var windowWidth = $('.widget-content' ,this.$widgetDiv).width();

        // make each li width window width divided by number of steps
        $('.steps li').css('width', windowWidth/countChildElem + 'px');

        // add tick to completed steps
        $('.steps li.complete h3').prepend('<span class="glyphicon glyphicon-ok"></span> ');

        // add cross to incomplete steps
        $('.steps li.incomplete h3').prepend('<span class="glyphicon glyphicon-remove"></span> ');

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

}