/**
	Set pw notification on widget load fail
*/
$(document).ajaxError(function(event, xhr, settings, thrownError) {
	if (xhr.status == 400 && settings.url.substring(0,20) == 'showWidgetAttributes'){
		var widgetName = settings.url.substr(settings.url.indexOf('name=') + 5);
		pw.notifyChannelOfEvent('loadFailed', {'name' : widgetName});
	}
});

function Widget_landlord_portal(){
	
	var widget = this
	
	/* channels */
	var channelSetPageTitles = 'landlord-portal.setPageTitles';
	var channelSetPageArgs = 'landlord-portal.setPageArgs';
	var channelClosePage = 'landlord-portal.closePage';
	var channelLoadFailed = 'loadFailed';

	nav = {
		homeContent: '',
		homeId: 'home',
		mountCache: {}
	}

	this.widgetPrefix = 'll-';
	this.errorMessage = "The page requested is not available, there may have been a problem loading or the content doesn't exist here yet";
	this.contentTemplate = '<article><div class="pagetitle page-header"></div><div class="widget"></div></article>';

	this.onReadyExtend = function() {
		/*store home layout*/
		nav.homeContent = $('#content').html();
		/*add listeners*/
		pw.addListenerToChannel(this, channelSetPageTitles);
		pw.addListenerToChannel(this, channelSetPageArgs);
		pw.addListenerToChannel(this, channelClosePage);
		pw.addListenerToChannel(this, channelLoadFailed);
		/*hook up page load handler*/
		$(window).on('hashchange', urlParse);
		/*load page*/
		urlParse();
		//initPopups();
	}

	this.handleEvent = function(channel, event) {
		if (channel == channelSetPageTitles) {
			updatePageTitle(event);
		} else if (channel == channelSetPageArgs) {
			updatePageArgs(event.pageId, event.args);
		} else if (channel == channelClosePage){
			window.location.hash = '';
		} else if (channel == channelLoadFailed && nav.mountCache[event.name]) {
			nav.mountCache[event.name] = false;
			this.loadFailed(event.name);
		}
	}

	function urlParse() {
		var hashtag = window.location.hash;
		console.debug('hashtag "' + hashtag + '"');
		if (hashtag.length > 1) {
			// Remove first #
			hashtag = hashtag.substr(1);

			var hashtagParts = hashtag.split('?');
			var pageId = hashtagParts[0];
			var pageArgs = hashtagParts[1];

			var idParts = pageId.split('/');
			var type = idParts[0];
			var subType = idParts[1];
			if(pageId != '' && pageId !== nav.homeId){
				try{
				loadContent(pageId, type, subType, pageArgs);
				} catch(error) {
					if(error.name == 'Error') {
						console.error('Unknown page operation');
					} else {
						console.error(error.message);
					}
			}
			} else {
				loadHome(pageArgs);
			}
			} else {
			loadHome();
		}
	}

	function loadContent(pageId, type, subType, pageArgs){
		var widgetName = widget.widgetPrefix + type + '-' + subType;
		var newContent = $(widget.contentTemplate).attr('pageid', pageId);
		if(!pw.defined(pageArgs)){
			pageArgs = '';
		}
		
			newContent.children('.widget')
				.attr({
					'name': widgetName,
				'pageid': pageId,
				'page.args': pageArgs
				})
				.data('page-type', type)

		loadPage(newContent);

	}

	function loadHome(pageArgs){
		$homeContent = $(nav.homeContent);
		$homeContent.children('.widget')
					.attr('page.args', pageArgs)
					.removeAttr('delayload');

		loadPage($homeContent);
	}

	function loadPage($content){
		$('#content').html($content);
		getPageWidgetDivs().each(function(){
			var name = $(this).attr('name');
			console.log('mounting widget: ' + name);

			if (!nav.mountCache[name]){
				nav.mountCache[name] = true; 
			}

			// on fail pw notification updates mount cache
			pw.mount($(this));
			if(nav.mountCache[name]){
				setTitle($(this).parents('article[pageId]'), {})
			}
		})
	}

	function updatePageTitle(data) {
		getContentArticles(data.pageId).each(function(){
			setTitle($(this), data);
		})
	}

	function updatePageArgs(pageId, args){
		getPageWidgetDivs(pageId).attr('page.args', args);
	}

	function setTitle(article, data) {
		if(!data.title){
			// pull the title fron the widget div
			var pulledTitle = article.children('div.widget').attr('page.title')
			data.title = pulledTitle ? pulledTitle : '';
			}

		if (!data.subtitle) {
			// default the subtitle
			data.subtitle = '';
		}
		
		var $title = article.find('.pagetitle')
						.addClass('clearfix')
						.html('<h2 class="pull-left">' + data.title + ' <small>' + data.subtitle + '</small></h2>');
		
		// append a link if specified
		if(data.link){
			$title.append('<h2 class="pull-right"><a href="' + data.link.hash + '">' + data.link.text + '</a></h2>');
		}
	}

	function getContentArticles(pageId){
		var articles = pageId ? 'article[pageid="' + pageId + '"]' : 'article';
		return $('#content ' + articles);
	}

	function getPageWidgetDivs(pageId){
		var widgets = pageId ? 'div.widget[pageid="' + pageId + '"]' : 'div.widget';
		return $('#content ' + widgets);
	}

	this.loadFailed = function(name){
		var failedWidget = getPageWidgetDivs().filter('[name="' + name + '"][pageid]');
		var pageId = failedWidget.attr('pageid');
		getPageWidgetDivs(pageId).hide().after('<div class="alert alert-info">' + this.errorMessage + '</div>');
		updatePageTitle({
			'pageId': pageId,
			'title': 'Content Not Available',
			'link' : {
				'text' : 'Back To Properties',
				'hash' : '#home'
			}
		});
	}



	/*function initPopups(){
		$("a.popup").live("click", function(){
			var hashtag = $(this).attr("href");
			hashtag = hashtag.substr(1);
			var hashtagParts = hashtag.split('?');
			var pageId = hashtagParts[0];
			var pageArgs = hashtagParts[1];
			var idParts = pageId.split('/');
			var type = idParts[0];
			var subType = idParts[1];
			$('#popup').attr('type', type);
			$("#popupContent").html("<div class='widget' name='scp-" + type + "-" + subType + "' page.id='" + pageId + "' page.args='" + pageArgs + "'>...</div>");
			pw.mount($("#popupContent .widget:first"));
			$("#popupContainer").show();
			return false;
		})
	}*/


}
