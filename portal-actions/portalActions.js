function Widget_portal_actions(){

     var 
        channelToggleDisplay = 'toggleActions'
    ;

    this.onReadyExtend = function(){
        $('.account-actions', this.$widgetDiv).hide();
        pw.addListenerToChannel(this, channelToggleDisplay);
    }

    this.handleEvent = function(channel, event) {
        if (event.animate === false){
            $('.account-actions', this.$widgetDiv).toggle();
        } else {
            $('.account-actions', this.$widgetDiv).slideToggle();
        }
    }
}