(function( $ ) {
    $.fn.imgz = function(options) {
        var settings = $.extend( {
            'imgSrc': 'image_list.txt',
            'imgRoot': 'img/',
            'blocksSrc': ['block1.html', 
                          'block2.html', 
                          'block3.html',
                          'block4.html'],
            'imgClass': 'imgz-img',
            'max': undefined
        }, options);
        
        var images;
        var imagesUsed = 0;
        
        $.ajax({
            async: false,
            type: "GET",
            url: settings.imgSrc,
            success: function(data) {
                images = data.split('\n');
                if (settings.max === undefined) {
                    settings.max = images.length;
                }
            }
        })
        
        // cache all the blocks so we don't have to fetch them repeatedly
        var blockCache = {};
        var nImgs = [];
        for (var i = 0; i < settings.blocksSrc.length; i++) {
            $.ajax({
                async: false,
                type: "GET",
                url: settings.blocksSrc[i],
                success: function(data) {
                    blockCache[settings.blocksSrc[i]] = data;
                    nImgs.push($('.' + settings.imgClass, data).length);
                }
            })
        }
        var minImgs = Math.min.apply(null, nImgs);
        
        while (images.length >= minImgs &&
               imagesUsed + minImgs <= settings.max) {
            var block =
                settings.blocksSrc[
                    Math.floor(Math.random()*settings.blocksSrc.length)];
            var template = blockCache[block];
            
            var newBlock = $(template).appendTo(this);
            var nImages = $('.' + settings.imgClass, newBlock).length;
            
            var blockImages = [];
            if (images.length >= nImages &&
                imagesUsed + nImages <= settings.max) {
                for (var j = 0; j < nImages; j++) {
                    var i = Math.floor(Math.random()*images.length);
                    blockImages.push(images.splice(i,1));
                }
            
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
                imagesUsed += nImages;
            } else {
                newBlock.remove();
            }
            
        }
        
        return this;
    };
})( jQuery );