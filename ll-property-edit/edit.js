function Widget_ll_property_edit(){
	var closeChannel = 'landlord-portal.closePage';
	var argsAttr = 'page.args';
	var pageIdAttr = 'page.id';

	this.onReadyExtend = function(){
		var args = this.$widgetDiv.attr(argsAttr);
		if(args == 'undefined' || args == 'false'){
			var thisPageId = this.$widgetDiv.attr(pageIdAttr);
			pw.notifyChannelOfEvent(closeChannel, {pageId : thisPageId})
		}
	}
}