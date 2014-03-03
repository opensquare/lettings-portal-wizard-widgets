function Widget_property_details(){

    var 
        widgetObject = this,
        propUrl = 'widgets/portfolio/properties.json',
        channelLoadPage = 'landlord-portal.loadPage'
    ;

    this.propertyId;
    this.docstoreBannerPath = 'docstore/property/{id}/banner.jpg';
    this.detailTpl;
    this.propTpl;

    this.initExtend = function() {
        if (pw.defined(this.parameterMap.entity)){
            this.propertyId = this.parameterMap.entity
        } else {
            this.propertyId = this.$widgetDiv.data('propid');
        }
    }

    this.onReadyExtend = function(){
        this.propTpl    = this.getHTML();
        this.detailTpl  = $('.dls-detail', $(this.propTpl));

        //this.setContent('');
        //this.loadProperty();
    }

    this.populateTemplate = function(property){
        var $template = $(this.propTpl).wrap('<div/>').parent();

        // set main details
        property.image = this.docstoreBannerPath.replace('{id}', property.id);
        $('.dls-banner', $template).text(property.image);
        $('.dls-address', $template).html(property.address.addressLine1);
        $('.dls-subtitle', $template).text(property.subtitle);
        $('.dls-summary', $template).text(property.summary);
        $('.dls-status', $template).text(property.status);
        $('.dls-description', $template).text(property.description);

        // set other properties
        $('.dls-details', $template).html('');
        for (var detail in property.details) {
            $('.dls-details', $template)
                .append(this.getDetailHTML({
                    name : detail,
                    value: property.details[detail]
                }));
        }
        $('.dls-details', $template).after(this.getPictures(property.id));

        this.setContent($template.html());
    }

    this.getDetailHTML = function(detail){
        var $template = this.detailTpl.clone();
        $('.dls-prop', $template) .text(detail.name);
        $('.dls-value', $template).text(detail.value);
        return $template;
    }

    this.getPictures = function(propertyId) {
        var 
            picTemplate = '<div class="col-sm-2">'
            +    '<div class="thumbnail">'
            +      '<div class="pic">doc/prop/{id}/{pic}.jpg</div>'
            +    '</div>'
            + '</div>',
            noOfPics = Math.ceil(Math.random() * 10), // random for now
            pictures = ''
        ;
        for (var i = 1; i <= noOfPics; i++){
            var pic = picTemplate.replace('{id}', propertyId).replace('{pic}', i);
            pictures += pic;
        }
        pictures += '<button type="button" class="btn-lg btn btn-default">Add picture</button>';

        return '<div class="row">' + pictures + '</div>';
    }


    this.loadProperty = function(){
        $.ajax({
            url: 'widgets/portfolio/properties.json',
            dataType: 'json',
        })
        .done(function(data) {
            var properties = data.properties;
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i].property;
                if (widgetObject.propertyId == property.id){
                    widgetObject.populateTemplate(property);
                }
            }
        })
        .fail(function(object, status, error){
            console.debug('error: ' + status + ' msg: ' + error);
        });
    }
}