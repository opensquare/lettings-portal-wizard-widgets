/**
	Set pw notification on widget load fail
*/
$(document).ajaxError(function(event, xhr, settings, thrownError) {
	if (xhr.status == 400 && settings.url.substring(0,20) == 'showWidgetAttributes'){
		var widgetName = settings.url.substr(settings.url.indexOf('name=') + 5);
		pw.notifyChannelOfEvent('portal.loadFailed', {'name' : decodeURIComponent(widgetName)});
	}
});

function Widget_portal(){

    var 
        widget = this,
        // channels
        channelSetPageArgs = 'portal.setPageArgs',
        channelClosePage = 'portal.closePage',
        channelLoadPage = 'portal.loadPage',
        channelLoadFailed = 'portal.loadFailed',
        // navigation state 
        navState = {
            homeContent   : '',
            homeId        : 'home',
            pageArgs      : '',
            currentLayout : '',
            mountCache    : {}
        }
    ;

    this.widgetPrefix = 'page-';
	this.errorMessage = "The page requested is not available, there may have been a problem loading or content doesn't exist here yet!";
	this.contentTemplate = '<div class="widget"></div>';

	this.onReadyExtend = function() {
		/*store home layout*/
		navState.homeContent = $('#content').html();
		/*add listeners*/
		pw.addListenerToChannel(this, channelSetPageArgs);
		pw.addListenerToChannel(this, channelClosePage);
		pw.addListenerToChannel(this, channelLoadFailed);
		pw.addListenerToChannel(this, channelLoadPage);
		/*hook up page load handler*/
		$(window).on('hashchange', urlParse);
		/*load page*/
		urlParse();
	}

	this.handleEvent = function(channel, event) {
		if (channel == channelSetPageArgs) {
			updatePageArgs(event.args);
		} else if (channel == channelClosePage){
			window.location.hash = '';
		} else if (channel == channelLoadPage) {
            changePage(event);
		} else if (channel == channelLoadFailed && navState.mountCache[event.name]) {
			navState.mountCache[event.name] = false;
			this.loadFailed(event.name);
		}
	}

	function urlParse() {
		var hashtag = window.location.hash;
		console.debug('hashtag "' + hashtag + '"');
		if (hashtag.length > 1) {
			// Remove first #
			hashtag = hashtag.substr(1);

            var 
                hashtagParts = hashtag.split('?'),
                pageId = hashtagParts[0],
                newPage = {
                    pageId  : pageId,
                    pageArgs: hashtagParts[1]
                }
            ;
			if(newPage.pageId != '' && newPage.pageId !== navState.homeId){
				try{
					loadContent(newPage);
				} catch(error) {
					if(error.name == 'Error') {
						console.error('Unknown page operation');
					} else {
						console.error(error.message);
					}
				}
			} else {
				loadHome(newPage.pageArgs);
			}
		} else {
			loadHome();
		}
	}

    function changePage(newPage) {
        if (!pw.defined(newPage.pageId)){
            newPage.pageId = navState.currentLayout;
        }
        if(!pw.defined(newPage.pageArgs)){
            newPage.pageArgs = nav.pageArgs;
        }
        newPage.pageArgs = (newPage.pageArgs === '') ? '' : '?' + newPage.pageArgs;

        window.location.hash = '#' + newPage.pageId + newPage.pageArgs;
    }

    function loadContent(newPage){
        var widgetName = widget.widgetPrefix + newPage.pageId,
            newContent = $(widget.contentTemplate),
            paramMap   = mapFromParamString(newPage.pageArgs)
        ;

        // pass channel names
        newContent.data({
            'ch-page-args' : channelSetPageArgs,
            'ch-page-close': channelClosePage,
            'ch-page-load' : channelLoadPage
        });
        // pass page arguments
        newContent.attr('name',widgetName);
        for (var param in paramMap){
            newContent.data(param, paramMap[param]);
        }

        // update nav state;
        navState.pageArgs = newPage.pageArgs;

        // load page
        loadPage(newContent);

	}

	function loadHome(pageArgs){
        var paramMap = mapFromParamString(pageArgs);
        navState.pageArgs = pageArgs;

        // load home page
		$homeContent = $(navState.homeContent);
        $homeContent.removeAttr('delayload');
		for (var param in paramMap){
            $homeContent.data(param, paramMap[param]);
        }

		loadPage($homeContent);
	}

    function loadPage($content){
        $('#content').html($content);
        var 
            $widgetToLoad = getPageWidgetDiv(),
            name = $widgetToLoad.attr('name')
        ;
        navState.currentLayout = name;
        console.log('mounting widget: ' + name);

        if (!navState.mountCache[name]){
            navState.mountCache[name] = true; 
        }

        pw.mount($widgetToLoad);
    }


    function updatePageArgs(args){
        var $widgetToUpdate = getPageWidgetDiv();
        for (var param in args){
            $widgetToUpdate.data(param, args[param]);
        }
    }


	function getPageWidgetDiv(){
		return $('#content>div.widget');
	}

	this.loadFailed = function(name){
		var failedWidget = getPageWidgetDiv().filter('[name="' + name + '"]');
		failedWidget.hide().after('<div class="alert alert-info">' + this.errorMessage + '</div>');
	}

    function mapFromParamString(string){
        if(!pw.defined(string)){
            return {};
        }
        var
            paramMap = {},
            pairs    = string.split('&'),
            pair,
            name,
            value
        ;
        for (var i = 0; i < pairs.length; i++) {
            pair  = pairs[i];
            name  = pair.substring(0, pair.indexOf("="));
            value = pair.substring(pair.indexOf("=") + 1);
            paramMap[name] = value;
        }
        return paramMap;
    }
}
