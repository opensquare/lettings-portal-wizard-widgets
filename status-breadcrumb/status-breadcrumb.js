function Widget_status_breadcrumb(){
    var
        actionUrl = 'widgets/action-summary/action-set.json'
    ;
    this.actionType;
    this.entity;

    this.initExtend = function(){
        var 
            responsePath = this.parameterMap.responsePath,
            entity = this.parameterMap.entity
        ;
        // if responsePath isn't set but entity and path is, form responsePath and add to parameter map
        if (!pw.defined(responsePath) && pw.defined(entity)){
            this.parameterMap.responsePath = 'widgets/' + this.name + '/entity-' + entity + '.xml';
        } else if (!pw.defined(responsePath)){
            this.parameterMap.responsePath = this.defaultUrl;
        }
        //this.actionType = this.$widgetDiv.data('action-type');
        //this.entity     = this.$widgetDiv.data('entity');
    }

    this.onReadyExtend = function(){
        // add icons
        $('li div.complete', this.$widgetDiv).append(' <span class="glyphicon glyphicon-ok"></span> ');
        $('li div.incomplete', this.$widgetDiv).append(' <span class="glyphicon glyphicon-remove"></span> ');
        $('li div.current', this.$widgetDiv).append(' <span class="glyphicon glyphicon-record"></span> ');
        $('li', this.$widgetDiv).slice(0, -1).after('<li class="spacer"><span class="glyphicon glyphicon-chevron-right"></span><span class="glyphicon glyphicon-chevron-right"></span></li>');
        // check params are valid
        //if (pw.defined(this.actionType) && pw.defined(this.entity)){
        //    this.setContent('');
        //    this.loadActionSet();
        //}
    }

    this.onLoadFailure = function() {
        var failedUrl = this.parameterMap.responsePath;
        console.debug('failed to load ' + failedUrl);
        // guard against recursion
        // if (!this.failedToLoad){
        //     this.failedToLoad = true;
        //     this.loadGenericResponse();
        //     this.addMessage('data file ' + failedUrl + ' not available. Displaying generic step page');
        // } else {
            this.clearMessages();
            this.setContent('Status information unavailable - data not found');
        //}
    }

    // this.generateActionSummaries = function (actions) {
    //     var 
    //         newRow = '<div class="row"></div>',
    //         $row = $(newRow)
    //     ;
    //     this.setContent('<h3>Progess summary</h3>');
    //     for (var i = 0; i < actions.length; i++) {
    //         if (i % 4 == 0 && i !== 0){
    //             $('.widget-content').append($row);
    //             $row = $(newRow);
    //         }
    //         $row.append(this.getActionSummaryWidget(actions[i]));
    //     };
    //     // append final row
    //     if ($row.find('div.widget').size() > 0){
    //         $('.widget-content').append($row);
    //     }
    //     $('div.widget', this.$widgetDiv).each(function() {
    //          pw.mount($(this));
    //     });
    // }

    // this.getActionSummaryWidget = function(actionSet) {
    //     var widgetDiv = '<div class="widget col-sm-3" name="action-summary" data-entity="' 
    //         + this.entity + '" data-set-type="' 
    //         + this.actionType + '" data-set-id="' 
    //         + actionSet.id + '" data-minimise="true"></div>'
    //     ;
    //     return widgetDiv;
    // }

    // this.loadActionSet = function(){
    //     var widgetObject = this;
    //     $.ajax({
    //         url: actionUrl,
    //         dataType: 'json'
    //     })
    //     .done(function(data) {
    //         for (var i = 0; i < data.length; i++){
    //             if (data[i].type === widgetObject.actionType) {
    //                 widgetObject.generateActionSummaries(data[i].actions);
    //             }
    //         }
    //     })
    //     .fail(function(object, status, error) {
    //         console.debug('error: ' + status + ' msg: ' + error);
    //         widgetObject.setContent('Problem encountered whilst loading property');
    //     });
    // }
}