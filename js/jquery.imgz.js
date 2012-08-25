(function( $ ) {
    $.fn.imgz = function(options) {
        var settings = $.extend( {
            'element': 'div',
            'imgSrc': 'image_list.txt',
            'imgRoot': 'img/',
            'blocksSrc': ['block1.html', 
                          'block2.html', 
                          'block3.html',
                          'block4.html'],
            'imgClass': 'imgz-img'
        }, options);
        
        var images;
        
        $.ajax({
            async: false,
            type: "GET",
            url: settings.imgSrc,
            success: function(data) {
                images = data.split('\n');
            }
        })
        
        while (images.length > 0) {
            var block =
                settings.blocksSrc[
                    Math.floor(Math.random()*settings.blocksSrc.length)];
            var nImages = 0,
                template;
            $.ajax({
                async: false,
                type: "GET",
                url: block,
                success: function(data) {
                    var pattern = /data-imgz-number="(\d+)"/
                    var match = pattern.exec(data);
                    nImages = parseInt(match[1]);
                    template = data;
                }
            });
            blockImages = [];
            if (images.length >= nImages) {
                for (var j = 0; j < nImages; j++) {
                    var i = Math.floor(Math.random()*images.length);
                    blockImages.push(images.splice(i,1));
                }
            
                var newBlock = $(template).appendTo(this);
            
                for (var i = 0; i < blockImages.length; i++) {
                    var img = new Image();
                    img.onload = (function(idx, bImgs) {
                        var thisImg = $($('.' + settings.imgClass,
                            newBlock)[idx]);
                        return function() {
                            thisImg.css("background-image",
                                'url(' + settings.imgRoot + 
                                    bImgs[idx] + ')')
                                .css("background-repeat", "no-repeat");
                            var blockWidth = thisImg.width();
                            var blockHeight = thisImg.height();
                            var finalHeight, finalWidth;
                            if (this.height / parseFloat(this.width) <
                                blockHeight / parseFloat(blockWidth)) {
                                finalHeight = blockHeight;
                                finalWidth =  blockHeight * 
                                    this.width / 
                                    parseFloat(this.height);
                                var xOffset = -.5*(finalWidth - blockWidth);
                                var yOffset = -.5*(finalHeight - blockHeight);
                                thisImg.css("background-position",
                                     xOffset + 'px ' + yOffset + 'px');
                            } else {
                                finalWidth = blockWidth;
                                finalHeight = blockWidth * 
                                    this.height / 
                                    parseFloat(this.width);
                            }
                            thisImg.css("background-size",
                                finalWidth + 'px ' + finalHeight + 'px');
                        }
                    })(i, blockImages);
                    img.src = settings.imgRoot + blockImages[i];
                }
            }
            
        }
        
        return this;
    };
})( jQuery );