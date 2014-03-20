function Widget_portal_home(){

    this.initExtend = function() {
        pw.addListenerToChannel(this, 'panel-rows');
    }

	this.onReadyExtend = function() {

	}

    this.handleEvent = function(channel, event) {
        addFormatting(event.id);
    }

    function addFormatting(widgetid){
        var 
            colDefinition = {
                "ic-heading"  : 2,
                "ic-item-set" : 10
            },
            panelWidget = $('#' + widgetid)
        ;
        // add responsive classes
        $('.items-container', panelWidget).addClass('row').addClass('property');
        for (var col in colDefinition){
            $("." + col, panelWidget).addClass('col-sm-' + colDefinition[col]);
        }

        // format links
        $('.is-type-links', panelWidget)
            .addClass('property-actions')
            .eq(0)
            .children('.is-item-text')
                .addClass('h4')
                .text(function(i, text){
                    return text + ' - ' + $('.ic-subtext', panelWidget).text();
                });

        // format progress
        $('.is-type-progress',panelWidget).addClass('property-progress');
        // remove unecessary header information
        $('.ic-heading',panelWidget).children().not('.ic-image').detach();
        // add some image placeholders
        getImage($('.ic-image', panelWidget));
    }

    function getImage(container){
        var src = 'http://placehold.it/600x400';
        container.attr('title', container.text()).html('<image src="' + src + '">');
    }
}