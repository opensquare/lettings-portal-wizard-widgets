function Widget_action_progress(){
    var
        actionUrl = 'widgets/action-summary/action-set.json'
    ;
    this.actionType;
    this.entity;

    this.initExtend = function(){
        this.actionType = this.$widgetDiv.data('action-type');
        this.entity     = this.$widgetDiv.data('entity');
    }

    this.onReadyExtend = function(){
        // check params are valid
        if (pw.defined(this.actionType) && pw.defined(this.entity)){
            this.setContent('');
            this.loadActionSet();
        }
    }

    this.generateActionSummaries = function (actions) {
        var 
            newRow = '<div class="row"></div>',
            $row = $(newRow)
        ;
        this.setContent('<h3>Progess summary</h3>');
        for (var i = 0; i < actions.length; i++) {
            if (i % 4 == 0 && i !== 0){
                $('.widget-content').append($row);
                $row = $(newRow);
            }
            $row.append(this.getActionSummaryWidget(actions[i]));
        };
        // append final row
        if ($row.find('div.widget').size() > 0){
            $('.widget-content').append($row);
        }
        $('div.widget', this.$widgetDiv).each(function() {
             pw.mount($(this));
        });
    }

    this.getActionSummaryWidget = function(actionSet) {
        var widgetDiv = '<div class="widget col-sm-3" name="action-summary" data-entity="' 
            + this.entity + '" data-set-type="' 
            + this.actionType + '" data-set-id="' 
            + actionSet.id + '" data-minimise="true"></div>'
        ;
        return widgetDiv;
    }

    this.loadActionSet = function(){
        var widgetObject = this;
        $.ajax({
            url: actionUrl,
            dataType: 'json'
        })
        .done(function(data) {
            for (var i = 0; i < data.length; i++){
                if (data[i].type === widgetObject.actionType) {
                    widgetObject.generateActionSummaries(data[i].actions);
                }
            }
        })
        .fail(function(object, status, error) {
            console.debug('error: ' + status + ' msg: ' + error);
            widgetObject.setContent('Problem encountered whilst loading property');
        });
    }
}