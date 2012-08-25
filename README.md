imgz
====

A jQuery plugin to create a varied grid of pictures for a slider (or something else). Originally intended to create a varied grid of pictures for a slider. This doesn't generate the slider, but will generate the grid.

More details later.

Usage
-----

    $('.imgz').imgz({
        'imgSrc': 'image_list.txt',  // a list of the image files
        'imgRoot': 'img/',  // path to the image files
		'max': undefined,   // max number of images to use.
						    // undefined means no max
        'blocksSrc': ['block1.html', 
                      'block2.html', 
                      'block3.html',
                      'block4.html'],  
					  // a list of the blocks to randomly choose from
        'imgClass': 'imgz-img'
			// class of elements in blocks that will hold images
    });
