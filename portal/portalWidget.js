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
        // channels
        channels = {
            setPageArgs     : 'portal.setPageArgs',
            closePage       : 'portal.closePage',
            loadPage        : 'portal.loadPage',
            loadFailed      : 'portal.loadFailed',
            preventPageLoad : 'portal.preventPageLoad'
        },
        pageLoader
    ;

    this.onReadyExtend = function() {
        pageLoader = new PageLoader();
        pageLoader.init({
            'ch-page-args' : channels.setPageArgs,
            'ch-page-close': channels.closePage,
            'ch-page-load' : channels.loadPage
        });
        /*add listeners*/
        pw.addListenerToChannel(this, channels.setPageArgs);
        pw.addListenerToChannel(this, channels.closePage);
        pw.addListenerToChannel(this, channels.loadFailed);
        pw.addListenerToChannel(this, channels.loadPage);
        pw.addListenerToChannel(this, channels.preventPageLoad);
        /*hook up page load handler*/
        $(window).on('hashchange', pageLoader.parseUrl);
        /*load page*/
        pageLoader.parseUrl();
	}

	this.handleEvent = function(channel, event) {
        switch (channel) {
            case channels.setPageArgs:
                pageLoader.changePageArgs(event);
                break;
            case channels.closePage:
                window.location.hash = '';
                break;
            case channels.loadPage:
                pageLoader.changePage(event);
                break;
            case channels.loadFailed:
                pageLoader.loadFailed(event.name);
                break;
            case channels.preventPageLoad:
                pageLoader.setPreventLoad(event);
                break;
        }
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

    function paramStringFromMap(map){
        var paramString = '';
        for (var param in map){
            var nameVal = param + '=' + map[param];
            if (paramString == ''){
                paramString += nameVal;
            } else {
                paramString += '&' + nameVal;
            }
        }
        return paramString;
    }

    function PageLoader() {
        var 
            navigation = {
                pageArgs      : null,
                currentLayout : null,
                disabled      : false,
                mountCache    : {},
                channels      : {}
            },
            defaults = {
                homeContent : null,
                basePath    : '#/',
                pagePrefix  : 'page-',
                content     : '<div class="widget"></div>',
                contentContainer : $('#content'),
                errorMessage: "The page requested is not available, there may have been a problem loading or content doesn't exist here yet!",
                homeId      : 'portal-home'
            },
            preventLoad = {}
        ;

        function init(pageChannels){
            defaults.homeContent = defaults.contentContainer.html();
            navigation.channels  = pageChannels; 
        }

        function disableHashNavigation(){
            navigation.disabled = true;
        }

        function enableHashNavigation(){
            navigation.disabled = false;
        }

        function parseHashString(string) {
            var 
                parts  = string.split('?'),
                pageId = parts[0].substring(defaults.basePath.length).replace("/", "-")
            ;
            return {
                id  : pageId,
                args: mapFromParamString(parts[1])
            };
        }

        function preparePage(newPage) {
            var widgetName = defaults.pagePrefix + newPage.id,
                newWidget = $(defaults.content)
            ;

            // pass channel names
            newWidget.data(navigation.channels);

            // pass page arguments
            newWidget.attr('name', widgetName);
            for (var param in newPage.args){
                newWidget.data(param, newPage.args[param]);
            }
            return newWidget;
        }

        function getPageWidgetDiv(){
            return $('div.widget', defaults.contentContainer).eq(0);
        }

        function getLayoutPath(pageId){
            if (pageId == defaults.homeId){
                return defaults.basePath;
            } else {
                return defaults.basePath + pageId;
            }
        }

        function loadPage($content) {
            var 
                name,
                mountable
            ;
            defaults.contentContainer.html($content);
            
            mountable = getPageWidgetDiv();
            name = mountable.attr('name');

            navigation.currentLayout = name.replace(defaults.pagePrefix, '');
            console.log('mounting widget: ' + name);

            if (!navigation.mountCache[name]){
                navigation.mountCache[name] = true; 
            }

            pw.mount(mountable);
        }

        function loadHome(argMap) {
            // load initial content
            var homeContent = $(defaults.homeContent);
            homeContent.removeAttr('delayload');

            for (var arg in argMap){
                homeContent.data(arg, argMap[arg]);
            }
            loadPage(homeContent);
        }

        function parseUrl(e) {
            
            var 
                hashtag = window.location.hash, // get hash from url
                newPage,
                widgetToLoad
            ;
            console.debug('hash: "' + hashtag + '"');

            // if navigation is disabled, re enable and do not reload layout.
            if (navigation.disabled){
                enableHashNavigation();
                return;
            }

            if (preventLoad.stopLoad) {
                var 
                    confirmation = confirm(preventLoad.unloadMessage),
                    oldUrl = e.originalEvent.oldURL,
                    oldHash = oldUrl.substring(oldUrl.indexOf('#') + 1)
                ;
                
                // notify of response
                pw.notifyChannelOfEvent(preventLoad.responseChannel, confirmation);

                // stay on current page and reset hash
                if (!confirmation){
                    // disable hash load
                    disableHashNavigation();
                    // revert url
                    window.location.replace(oldHash);

                    // do not continue
                    return;
                }
            }

            // enforce leading /
            if (hashtag.substring(0,defaults.basePath.length) !== defaults.basePath){
                // disable navigation so content isn't loaded twice
                disableHashNavigation();
                window.location.replace(defaults.basePath + hashtag.replace('#',''));
                hashtag = defaults.basePath + hashtag.replace('#','');
            }

            if (hashtag !== defaults.basePath) {
                // load page
                newPage = parseHashString(hashtag);
                // update nav state;
                navigation.pageArgs = newPage.args;
                if (pw.defined(newPage.id) && newPage.id.length > 0) {
                    // create widget div
                    widgetToLoad = preparePage(newPage);
                    // load page
                    loadPage(widgetToLoad);
                } else {
                    loadHome(newPage.args);
                }
            } else {
                // load home
                loadHome();
            }
        }

        function changePageArgs(event){
            var 
                args = event.args,
                $widgetToUpdate = getPageWidgetDiv(),
                newPage = {
                    pageArgs : paramStringFromMap(args)
                },
                currentArgs = navigation.pageArgs
            ;

            // retain existing parameters and add/overwrite others
            if (event.updateExisting){
                for (var param in args) {
                    currentArgs[param] = args[param];
                }
                newPage.pageArgs = paramStringFromMap(currentArgs);
                args = currentArgs;
            }

            if (!event.reloadPage){
                disableHashNavigation();
                for (var param in args){
                    $widgetToUpdate.data(param, args[param]);
                }
                navigation.pageArgs = args;
            }

            changePage(newPage);
        }

        function changePage(newPage) {
            var 
                path,
                argString
            ;
            if (!pw.defined(newPage.pageId)){
                newPage.pageId = navigation.currentLayout;
            }
            if(!pw.defined(newPage.pageArgs)){
                newPage.pageArgs = '';
            }
            path = getLayoutPath(newPage.pageId);
            argString = (newPage.pageArgs === '') ? '' : '?' + newPage.pageArgs;

            window.location.hash = path + argString;
        }

        function loadFailed(name) {
            var failedWidget;
            if (navigation.mountCache[name]){
                navigation.mountCache = false;
                failedWidget = getPageWidgetDiv().filter('[name="' + name + '"]');
                failedWidget.hide().after('<div class="alert alert-info">' + defaults.errorMessage + '</div>');
            }
        }

        function setPreventLoad(preventRequest) {
            preventLoad.stopLoad = preventRequest.preventLoad;
            preventLoad.unloadMessage   = pw.defined(preventRequest.message) ? preventRequest.message : '';
            preventLoad.responseChannel = preventRequest.responseChannel;
        }

        return {
            init : init,
            parseUrl : parseUrl,
            changePageArgs : changePageArgs,
            changePage : changePage,
            loadFailed : loadFailed,
            setPreventLoad : setPreventLoad
        }
    }
}
