function Widget_landlord_portal(){
	var channelSetPageTitles = 'landlord-portal.setPageTitles';
	var channelSetPageArgs = 'landlord-portal.setPageArgs';
	var channelClosePage = 'landlord-portal.closePage'

	this.onReadyExtend = function() {
		$(window).on('hashchange', urlParse);
		pw.addListenerToChannel(this, channelSetPageTitles);
		pw.addListenerToChannel(this, channelSetPageArgs);
		pw.addListenerToChannel(this, channelClosePage);
		urlParse();
		setAsideClickHandler($('#content-asides aside'));
		//initPopups();
	}

	this.handleEvent = function(channel, event) {
		if (channel == channelSetPageTitles) {
			setPageTitles(event.pageId, event.title, event.subTitle);
		} else if (channel == channelSetPageArgs) {
			setPageArgs(event.pageId, event.args);
		} else if (channel == channelClosePage){
			removePage(event.pageId);
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

			// check for existing page
			var $existingPage = getAsideAndArticle(pageId);
			if($existingPage.size()) {
				// switch page
				selectPage(pageId);
			} else {
				try{
					addPage(pageId, type, subType, pageArgs);
				} catch(error) {
					if(error.name == 'Error') {
						console.error('Unknown page operation');
					} else {
						console.error(error.message);
					}
//					window.location.hash = '';
				}
			}
		} else {
			selectPage('internal/portfolio');
		}
	}

	function addPage(pageId, type, subType, pageArgs) {
		// Create tab
		var pageHash = pageId;
		if (pw.defined(pageArgs)) {
			pageHash = pageHash + '?' + pageArgs;
		}
		$('#content-asides').append(
			$('<aside/>').attr('pageId', pageId).attr('type', type).attr('subType', subType).attr('hash', pageHash).addClass('on')
				.append($('<div/>').addClass('title'))
				.append($('<div/>').addClass('subtitle'))
		);

		// Create page
		var widgetName = 'll-' + type + '-' + subType;
		$('#content-articles').append(
			$('<article/>').attr('pageId', pageId).attr('type', type).attr('subType', subType).addClass('on')
				.append('<section class="content-header"> \
					<a href="#" class="action" action="removePage">close</a> \
                    <h2 class=\'title\'/> \
                    <h3 class=\'subtitle\'/> \
                </section> \
                <section class="content-helper"></section> \
                <section class="content-body"> \
                    <div class="widget" name="' + widgetName + '" page.id="'+ pageId + '" page.args="' + pageArgs + '"></div> \
                </section>')
		);

		setAsideClickHandler($('#content-asides aside[pageId="' + pageId + '"]'));

		$('#content-articles article[pageId="' + pageId + '"] a[action="removePage"]').click(function() {
			removePage(pageId);
			return false;
		});

		// Load widget
		var $newWidget = $('#content-articles article[pageId="' + pageId + '"] .widget').first();
		if (pw.defined(pageArgs)) {
			$newWidget.attr('page.args', pageArgs);
		}
		console.log('mount widget' + $newWidget.attr('name'));
		pw.mount($newWidget);
		pullPageTitles(pageId, $newWidget);
		selectPage(pageId);
	}

	function pullPageTitles(pageId, $newWidget) {
		var title = $newWidget.attr('page.title');
		var subtitle = $newWidget.attr('page.subtitle');
		setPageTitles(pageId, title, subtitle);
	}

	function setPageTitles(pageId, title, subTitle) {
		var $asideAndArticle = getAsideAndArticle(pageId);
		if (title) $asideAndArticle.find('.title').html(title);
		if (subTitle) $asideAndArticle.find('.subtitle').html(subTitle);
	}

	function setPageArgs(pageId, args) {
		getAsideAndArticle(pageId).attr('args', args);
	}

	function setAsideClickHandler($selection) {
		$selection.click(function() {
			var hash = $(this).attr('hash');
			if (!pw.defined(hash)) {
				hash = '';
			}
			window.location.hash = hash;
		})
	}

	function selectPage(pageId) {
		$('#content aside[pageId].on,#content article[pageId].on').removeClass('on');
		getAsideAndArticle(pageId).addClass('on');
	}

	function getAsideAndArticle(pageId) {
		return $('#content aside[pageid="' + pageId + '"], #content article[pageid="' + pageId + '"]');
	}

	function removePage(pageId) {
		// copy details to recently closed section
		// TODO - de-dupe and limit recently closed list
		var oldPage = $('#content aside[pageId="' + pageId + '"]');
		var type = oldPage.attr('type');
		var subType = oldPage.attr('subType');
		var hash = oldPage.attr('hash');
		var title = oldPage.children('.title').text(); // TODO - limit to 40 characters
		/*$('#content #new-closed').append(' \
			<a class="new-square" href="#' + hash + '" type="' + type + '" subType="' + subType + '")>' + title + '</a>');*/
		// remove tab/page
		getAsideAndArticle(pageId).remove();
		// select first remaining page
		$('#content aside[pageId]').first().click();
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


	function pulldownToggle(element, selector) {
		//initEditors();
		var onAlready = $(element).hasClass('on')

		if(onAlready != true){
			initEditors();
			$(element).addClass('on').parentsUntil('div.widget[name]').find('.content-header-pulldown>div.widget[name='+selector+']').slideDown('fast');
		} else {
			destroyEditors();
			$(element).parent().children().removeClass('on').parentsUntil('div.widget[name]').find('.content-header-pulldown>div.widget[name]').slideUp('fast');
		}
	}
}