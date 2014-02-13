function Widget_landlord_portal(){
	
	/* channels */
	var channelSetPageTitles = 'landlord-portal.setPageTitles';
	var channelSetPageArgs = 'landlord-portal.setPageArgs';
	var channelClosePage = 'landlord-portal.closePage';

	var widget = this,
	newWidgetPrefix = 'll-',
	currentHash;

	nav = {
		homeContent: '',
		homeId: 'home',
	}

	var contentTemplate = '<article><div class="pagetitle page-header"></div><div class="widget"></div></article>';

	this.onReadyExtend = function() {
		/*store home layout*/
		nav.homeContent = $('#content').html();
		currentHash = window.location.hash;
		/*add listeners*/
		pw.addListenerToChannel(this, channelSetPageTitles);
		pw.addListenerToChannel(this, channelSetPageArgs);
		pw.addListenerToChannel(this, channelClosePage);
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
		$('#content article').each(function(){
			setTitle($(this));
		})
		currentHash = hashtag;
	}

	function loadContent(pageId, type, subType, pageArgs){
		var widgetName = newWidgetPrefix + type + '-' + subType;
		var newContent = $(contentTemplate).attr('pageid', pageId);
			newContent.children('.widget')
				.attr({
					'name': widgetName,
					'pageid': pageId
				})
				.data('page-type', type)
		if (pw.defined(pageArgs)) {
			newContent.children('.widget').attr('page.args', pageArgs);
		}
		loadPage($('#content').html(newContent));

	}

	function loadHome(pageArgs){
		$homeContent = $(nav.homeContent);
		$homeContent.children('.widget').attr('page.args', pageArgs).removeAttr('delayload');
		loadPage($('#content').html($homeContent));
	}

	function loadPage($content){
		$content.find('div.widget').each(function(){
			console.log('mounting widget: ' + $(this).attr('name'));
			pw.mount($(this));
		})
	}

	function updatePageTitle(data) {
		$('#content article[pageid="' + data.pageId + '"').each(function(){
			setTitle($(this), data);
		})
	}

	function updatePageArgs(pageId, args){
		$('#content div.widget[pageid="' + pageId + '"').attr('page.args', args);
	}

	function setTitle($article, data) {
		if (!data) {
			data = {}
			data.title = $article.children('div.widget').attr('page.title');
			}
		if (!data.subtitle) {
			data.subtitle = '';
		}
		$title = $article.find('.pagetitle').addClass('clearfix').html('<h2 class="pull-left">' + data.title + ' <small>' + data.subtitle + '</small></h2>');
		
		if(data.link){
			$title.append('<h2 class="pull-right"><a href="' + data.link.hash + '">' + data.link.text + '</a></h2>');
		}
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
