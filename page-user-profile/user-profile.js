function Widget_page_user_profile(){

	var 
		widgetObject = this,
		closeChannel,
		contentId
	;

	this.closeChannelAttr = 'ch-page-close',
	this.contentIdAttr   = 'content';

	this.initExtend = function(){
		// pick up passed data
		closeChannel = this.$widgetDiv.data(this.closeChannelAttr);
		contentId   = this.$widgetDiv.data(this.contentIdAttr);
		if(!pw.defined(this.parameterMap.entity)){
			this.parameterMap.entity = contentId;
		}

	}

	this.onReadyBeforeChildImport = function(){
		if(!pw.defined(contentId) || contentId === '' || !contentId){
			this.setContent('');
			pw.notifyChannelOfEvent(closeChannel, {})
		} else {
			this.setContainedWidgetParams();
		}
	}

	this.setContainedWidgetParams = function(){
		$('div.widget', this.$widgetDiv).each(function(){
			$(this).attr('params', 'entity=' + contentId + '&path=' + widgetObject.name);
		})
	}
}
