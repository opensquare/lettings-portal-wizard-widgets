function Widget_portal_panel(){

    this.publishOn;

    this.initExtend = function() {
        // add layout defined listener to pick up change in uids
        var listenOn = this.$widgetDiv.data('channel-listen');
        if (pw.defined(listenOn)) {
            pw.addListenerToChannel(this,listenOn);
        }
        // assign publish channel
        this.publishOn = this.$widgetDiv.data('channel-publish');
    }

    this.onReadyExtend = function(){
        var uids = '';
        // gather uids and publish them on layout defined channel
        if(pw.defined(this.publishOn)) {
            $('.ic-item-set', this.$widgetDiv).each(function(){
                var uid = $(this).data('uid');
                uids += (uids === '') ? uid : ',' + uid;
            });
            //pw.notifyChannelOfEvent(this.publishOn, {uids : uids, id:this.id});
        }
        // depending on type, apply any event handlers to content
    }

    this.handleEvent = function(channel, event) {
        // read in uids and re/load widget
        this.parameterMap.uids = event.uids;
        this.loadHTML();
    }

    this.onLoadFailed = function() {
        // display some generic message
    }
}