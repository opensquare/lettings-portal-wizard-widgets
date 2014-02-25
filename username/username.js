function Widget_username() {
	
	var 
		widgetObject = this,
		hiddenText = 'I want to... <span class="caret"></span>',
        visibleText = 'Hide Options <span class="caret"></span>',
        channelToggleActions = 'toggleActions'
	;

	/*this.onReadyExtend = function(){
		$('.user-name', this.$widgetDiv).click(function(){
			$('.user-links', widgetObject.$widgetDiv).show();
		});

		$('.user-name-wrapper', this.$widgetDiv).mouseleave(function(){
			$('.user-links', widgetObject.$widgetDiv).hide();
		});

		$('a.toggle-actions', this.$widgetDiv)
            .html(hiddenText)
            .click(function(event) {
                widgetObject.notifyToggle();
                return false;
            });
        pw.addListenerToChannel(this,channelToggleActions);
	}

	this.handleEvent = function(channel, event){
		this.switchActionText();
	}

	this.notifyToggle = function(){
		pw.notifyChannelOfEvent(channelToggleActions, {});
	}

	this.switchActionText = function(){
		var $link = $('a.toggle-actions', this.$widgetDiv);
		$link.html($link.html() == hiddenText ? visibleText : hiddenText);
	}*/

}