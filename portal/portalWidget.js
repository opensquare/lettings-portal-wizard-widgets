/**
    Set pw notification on widget load fail
*/
$(document).ajaxError(function(event, xhr, settings) {
    if (xhr.status == 400 && settings.url.substring(0,20) == 'showWidgetAttributes'){
        var widgetName = settings.url.substr(settings.url.indexOf('name=') + 5);
        pw.notifyChannelOfEvent('portal.loadFailed', {'name' : decodeURIComponent(widgetName)});
    }
});

function Widget_portal(){

    this.channels = {
        setPageArgs : 'portal.setPageArguments',
        gotoHomePage     : 'portal.gotoHomePage',
        pageLoadFailed   : 'portal.loadFailed',
        promptOnPageChange : 'portal.preventPageLoad'
    };
    this.pageLoader = new PageLoader();
    
    /*
        Widget overrides
    */
    this.onReadyBeforeChildImport = function() {
        this.pageLoader.init($('#content'), this.channels);
        this.addListeners();
    }

    this.onReadyExtend = function() {
        this.pageLoader.mountAfterImport();
    }

    this.handleEvent = function(channel, event) {
        this.pageLoader.handleEvent(channel, event);
    }

    /*
        util functions
    */

    this.addListeners = function() {
        pw.addListenerToChannel(this, this.channels.setPageArgs);
        pw.addListenerToChannel(this, this.channels.gotoHomePage);
        pw.addListenerToChannel(this, this.channels.pageLoadFailed);
        pw.addListenerToChannel(this, this.channels.promptOnPageChange);
    }

    function mapFromString(string){
        var pairs = string.split('&'), map = {};
        for (var i = 0; i < pairs.length; i++) {
            var pair  = pairs[i];
            var name  = pair.substring(0, pair.indexOf("="));
            var value = pair.substring(pair.indexOf("=") + 1);
            map[name] = value
        }
        return map;
    }

    function paramStringFromMap(map){
        var paramString = '';
        for (var param in map){
            var nameVal = param + '=' + map[param];
            paramString += paramString == '' ? nameVal : '&' + nameVal;
        }
        return paramString;
    }

    /*
        Page loader for handling loading of layouts by monitoring hash url
    */
    function PageLoader() {
        var
            statics = {
                basePath : '#/',
                widgetPrefix : 'page-',
                errorMessage : "The page requested was not found",
            },
            layoutState = {
                promptOnChangeRequest : null,
                mountCache : []
            },
            content = {},
            channels = {}
        ;

        function enableHashParsing() {
            layoutState.parsingEnabled = true;
        }

        function disableHashParsing() {
            layoutState.parsingEnabled = false;
        }

        function confirmChange() {
            return confirm(layoutState.promptOnChangeRequest.message);
        }

        function parseHash(hashUrl) {
            var 
                parts  = hashUrl.split('?'),
                pageId = parts[0].substring(statics.basePath.length).replace("/", "-")
                newPage = {};
            ;
            newPage.path = parts[0];
            newPage.id = pageId == '' ? pageId : statics.widgetPrefix + pageId;
            if (pw.defined(parts[1])) {
                newPage.arguments = mapFromString(parts[1]);
            } else {
                newPage.arguments = {};
            }

            return newPage;
        }

        function getPageWidget() {
            return $('div.widget', content.container).eq(0);
        }

        function mountPage($content, arguments) {
            var 
                widgetSelector = 'div.widget',
                widgetMount,
                name;

            // get / set necessary data
            $(widgetSelector, $content).addBack().data('arguments', arguments);
            name = $(widgetSelector, $content).addBack().eq(0).attr('name');

            // add to DOM
            content.container.html($content);

            if(layoutState.mountCache.indexOf(name) < 0) {
                layoutState.mountCache.push(name);
            }

            console.log('mounting widget: ' + name);
            
            if(layoutState.initialLoad){
                pw.mount($(widgetSelector, content.container));
            } else { 
                // widget attributes may not be correct so loading will be delegated to mountAfterImport during onReadyExtend
                $(widgetSelector, content.container).attr('delayload', 'true');
            }

        }

        function mountAfterImport(){
            pw.mount($('div.widget', content.container).removeAttr("delayload"));
        }

        function loadHome(arguments) {
            var toLoad = $(content.initial);
            $('[delayload]', toLoad).addBack().removeAttr('delayload');
            mountPage(toLoad, arguments);
        }

        function loadNewPage(pageToLoad) {
            var newWidget = $('<div class="widget"></div>');

            newWidget.data('portal-channels', channels);
            newWidget.attr('name', pageToLoad.id);

            mountPage(newWidget, pageToLoad.arguments);
        }

        function parseUrl(changeEvent) {
            // if parsing is disabled, re enable and do not continue.
            if (!layoutState.parsingEnabled) {
                enableHashParsing();
                return;
            }
            if (layoutState.promptOnChangeRequest !== null) {
                var leavingPage = confirmChange();

                pw.notifyChannelOfEvent(layoutState.promptOnChangeRequest.responseChannel, leavingPage);

                if (!leavingPage){
                    var oldURL = changeEvent.originalEvent.oldURL;
                    // not changing. Revert Url and do not continue
                    disableHashParsing();
                    window.location.replace(oldURL.substring(oldURL.indexOf('#')));
                    return;
                }
                // changing, remove prompt
                layoutState.promptOnChangeRequest = null;
            }

            var hash = window.location.hash;
            console.log('hash: "' + hash + '"');
            var pageToLoad;

            // enforce leading base path
            if (hash.substring(0, statics.basePath.length) !== statics.basePath) {
                var newHash = statics.basePath + hash.replace('#', '');
                disableHashParsing(); // so content doesn't get loaded twice

                window.location.replace(newHash);
                hash = newHash;
            }

            pageToLoad = parseHash(hash);
            layoutState.page = pageToLoad;

            if (pageToLoad.id == '' && !layoutState.initialLoad) {
                // landing page on initial page load
                var homeWidgets = $('div.widget', content.container);
                homeWidgets.data('arguments', pageToLoad.arguments);
                homeWidgets.data('portal-channels', channels);
                $('[delayload]', content.container).removeAttr('delayload');
            } else if (pageToLoad.id == '') {
                loadHome(pageToLoad.arguments);
            } else {
                loadNewPage(pageToLoad);
            }

        }

        /* 
            event handlers
        */

        function setPageArgs(event) {
            var args = event.args,
                pageWidget,
                argString,
                newPage = layoutState.page,
                currentHash = window.location.hash
            ;
            if (pw.defined(args)) {
                pageWidget = getPageWidget();

                // retain existing parameters and add/overwrite others
                if (event.updateExisting) {
                    for (var param in args) {
                        newPage.arguments[param] = args[param];
                    }
                    args = newPage.arguments;
                }

                if (event.reloadPage === false) {
                    disableHashParsing();
                    pageWidget.data('arguments', args);
                    layoutState.page.arguments = args;
                }
                argString = paramStringFromMap(args);
                argString = '' ? '' : '?' + argString;

                if (currentHash == newPage.path + argString) {
                    // hash won't change so just re enable navigation if disabled
                    enableHashParsing();
                    return
                }
                window.location.hash = newPage.path + argString;
            }
        }

        function loadFailed(name) {
            var failedWidget, 
                cacheIndex = layoutState.mountCache.indexOf(name);
            if (cacheIndex >= 0){
                layoutState.mountCache.splice(cacheIndex,1);
                failedWidget = getPageWidget().filter('[name="' + name + '"]');
                failedWidget.hide().after('<div class="alert alert-info">' + statics.errorMessage + '</div>');
            }
        }

        function setPreventLoadRequest(request) {
            if (request.preventLoad === true) {
                if (!pw.defined(request.message)){
                    request.message = 'You are about to leave the current page, any data you have entered may not be saved. Do you wish to continue?'
                }
                layoutState.promptOnChangeRequest = request;
            } else {
                layoutState.promptOnChangeRequest = null;
            }
        }

        function handleEvent(channel, event){
            switch (channel) {
                case channels.setPageArgs:
                    setPageArgs(event);
                    break;
                case channels.gotoHomePage:
                    window.location.hash = '';
                    break;
                case channels.pageLoadFailed:
                    loadFailed(event.name);
                    break;
                case channels.promptOnPageChange:
                    setPreventLoadRequest(event);
                    break;
            }
            
        }

        function init(container, portalChannels) {
            // initialise variables
            content.container = container;
            content.initial   = container.html();
            channels          = portalChannels;
            enableHashParsing();

            // hook up page load handler and load page
            $(window).on('hashchange', parseUrl);
            parseUrl();
            layoutState.initialLoad = true;
        }

        return {
            init : init,
            mountAfterImport: mountAfterImport,
            handleEvent: handleEvent
        }
    }
}