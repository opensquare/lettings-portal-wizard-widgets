function Widget_image_browser() {


    this.initExtend = function() {
    }

    this.onReadyExtend = function() {
        var fh = new FileHandler(this.$widgetDiv);
        //this.loadImages();
    }

    this.handleEvent = function() {}

    this.loadImages = function() {
        // generate some thumbnails for now
        this.generateThumbnails();
    }

    this.generateThumbnails = function() {
        var 
            noOfImages = Math.ceil(Math.random() * 10),
            template = $('.images-container', this.$widgetDiv).html()
        ;
        $('.images-container', this.$widgetDiv).html('');
        for (var i = 0; i < noOfImages; i++) {
            if (i % 6 !== 0){
                $('.images-container .row', this.$widgetDiv).last().append('<div class="col-sm-2">' + template + '</div>');
            } else {
                $('.images-container', this.$widgetDiv).append('<div class="row"></div>');
                $('.images-container .row', this.$widgetDiv).last().append('<div class="col-sm-2">' + template + '</div>');
            }
        }
    }

    function FileHandler(w) {
        var 
            fileWidgetDiv,
            fileDropArea,
            filesToUpload = []
        ;

        function getGenerateThumbnail(file) {
            return function(e) {
                var t = $('<li class="media">').html([
                    '<img class="media-object pull-left" style="width:initial;max-width:200px;" src="',
                    e.target.result,
                    '" title="',
                    encodeURIComponent(file.name),
                    '"/>',
                    '<div class="media-body"><strong>', 
                        encodeURIComponent(file.name), 
                    '</strong> (',
                        file.type || 'n/a',
                    ') - ',
                    file.size, ' bytes, last modified: ',
                    file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</div>'].join('')
                );
                $('#output_file_list ul', fileWidgetDiv).append(t);
            }
        }

        function addImagesToUpload(files){
            var 
                i, f, reader
            ;

            for (i = 0; f = files[i]; i++) {
                if (!f.type.match('image.*')){
                    continue;
                }
                // add file to list of files to upload
                filesToUpload.push(f);

                reader = new FileReader();
                reader.onload = getGenerateThumbnail(f);
                reader.readAsDataURL(f);

            }
        }

        function onFileSelect(evt) {
            addImagesToUpload(evt.target.files);
        }

        function onDropFile(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            addImagesToUpload(evt.dataTransfer.files);
        }

        function onDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        function onUpload(evt){
            evt.stopPropagation();
            evt.preventDefault();
            for (var i = 0; i < filesToUpload.length; i++){
                console.debug(filesToUpload[i]);
            }
        }

        function init(w) {
            if(window.File && window.FileReader && window.FileList && window.Blob) {
                fileWidgetDiv = w;

                // make event.dataTransfer available to jQuery Event object
                $.event.props.push("dataTransfer");

                // assign handlers
                $('#input_image_files', fileWidgetDiv).change(onFileSelect);
                $('#image_drop_zone', fileWidgetDiv).on('dragover', onDragOver);
                $('#image_drop_zone', fileWidgetDiv).on('drop', onDropFile);
                $('button[type=submit]', fileWidgetDiv).on('click', onUpload);
            }
        }

        init(w);
    }
}