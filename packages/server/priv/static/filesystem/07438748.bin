include lib/graphics.4th 
include lib/gcircle.4th 
\ include lib/gshrink.4th 
 
\ Want to test hshrink and hexpand gaspect.4th 
include lib/gaspect.4th 
 
400 pic_width ! 
400 pic_height ! 
black 255 whiteout 
 
200 200 50 circle 
s" test.ppm" save_image 
 
\ Decrese the image height by a factor of 2 
hshrink 
s" hshrink-t1.ppm" save_image 
 
\ Note the "other half of the full circle is still there 
\ becasue the image with is still 400 pixels.  So just save the 
\ processed image. 
s" hshrink-t2.ppm" 0 0 200 400 crop 
 
 
\ Increase the image height by factor of 2 
hexpand 
 
\ Will expect a loss of resolution  in making the image bigger. 
\ Let's see how much by redrawing the circle for comparison.
200 200 50 red circle 
s" hexpand-test.ppm" save_image 
