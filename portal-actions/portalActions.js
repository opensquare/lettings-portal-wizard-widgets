function Widget_portal_actions(){

    this.onReadyExtend = function(){
        var widgetObject = this;
        $('button.toggle', this.$widgetDiv).click(function(event) {
            $('.account-actions', widgetObject.$widgetDiv).slideToggle();
            $(this).text($(this).text() == 'hide' ? 'show' : 'hide');
        });
    }
}