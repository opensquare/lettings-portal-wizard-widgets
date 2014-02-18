function Widget_property_summary(){

    var
        docstoreThumbnailPath = 'docstore/property/{id}/thumbnail.jpg',
        channelLoadPage = 'landlord-portal.loadPage',
        channelPropertyInfo = 'property_info';

    var
        widgetObject,
        articleTpl;

    this.onReadyExtend = function() {
        var propertyId = this.$widgetDiv.data('propid');
        widgetObject   = this;
        articleTpl     = $('article', this.$widgetDiv);

        if (pw.defined(propertyId)) {
            this.loadProperty(propertyId);
        } else {
            this.setContent('Property summary - no property set');
        }
    };

    this.createActionButton = function(propertyId, action){
        var
            $button = $('<button type="button" class="btn"></button>'),
            complete = action.totalSteps == action.completed ? 100 : Math.ceil((action.completed / action.totalSteps) * 100),
            stepText = action.action + ': ' + action.completed + '/' + action.totalSteps + ' complete';

        $button.text(stepText);
        if (complete === 0) {
            $button.addClass('disabled btn-default');
        } else {
            $button
                .addClass('btn-primary')
                .css('background-color', 'rgba(50,118,177,' + complete / 100 + ')') //color taken from bootstrap btn-primary
                .click(function(event) {
                    var newPage = {
                        type: 'property',
                        subType : action.portalWidget,
                        pageArgs: propertyId
                    }
                    pw.notifyChannelOfEvent(channelLoadPage, newPage);
                });
        }
        if (complete <= 50) {
            $button.css('color', '#000');
        }

        return $button;
    }

    this.createMessageBadge = function(noOfMessages) {
        var $mesageHTML = $('<h3><span class="label label-info"><span>x</span> new messages</span></h3>');
        $('.label span', $mesageHTML).text(noOfMessages);
        return $mesageHTML;
    }

    this.populateProperty = function(property){
        var $actionContainer = $('.ps-actions', articleTpl);

        // load thumbnail
        property.image = docstoreThumbnailPath.replace('{id}', property.id);

        // set main text
        $('.image div', articleTpl).text(property.image);
        $('summary .address', articleTpl).html(property.address.addressLine1);
        $('summary .sub', articleTpl).text(property.subtitle);
        $('summary .description', articleTpl).text(property.summary);
        $('summary .rentalStatus', articleTpl).text(property.status);
        $('section>div', articleTpl).text(property.description);

        // populate action summary
        var i;
        for (i = 0; i < property.actions.length; i++) {
            $actionContainer.append(this.createActionButton(property.id, property.actions[i]));
        }

        if (property.messages > 0) {
            $actionContainer.before(this.createMessageBadge(property.messages));
        }
        this.addHandlers(property);
    }

    this.loadProperty = function(propertyId) {
        $.ajax({
            url: 'widgets/portfolio/properties.json',
            dataType: 'json',
        })
        .done(function(data) {
            var properties = data.properties;
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i].property;
                if (propertyId == property.id){
                    widgetObject.populateProperty(property);
                }
            }
        })
        .fail(function(object, status, error){
            console.debug('error: ' + status + ' msg: ' + error);
            widgetObject.setContent('Problem encountered whilst loading property');
        });
    }

    this.addHandlers = function(property){
        $('.image, summary .address', articleTpl).click(function(){
            window.location.hash = 'property/details?' + property.id;
            pw.notifyChannelOfEvent(channelPropertyInfo, {id: property.id, address: property.address, status: property.status});
        });
    }
}