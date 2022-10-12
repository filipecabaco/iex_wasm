include lib/graphics.4th 
include lib/gcircle.4th 
\ include lib/gshrink.4th 
 
\ Want to test wshrink and wexpand from gaspect.4th  
include lib/gaspect.4th 
 
400 pic_width ! 
400 pic_height ! 
black 255 whiteout 
 
200 200 50 circle 
s" test.ppm" save_image 
 
\ Decrese the image width by a factor of 2 
wshrink 
s" wshrink-t1.ppm" save_image 
 
\ Note the "other half of the full circle is still there 
\ becasue the image with is still 400 pixels.  So just save the 
\ processed image.
s" wshrink-t2.ppm" 0 0 400 200 crop 
 
 
\ Increase the image width by factor of 2 
wexpand 
 
\ Will expect a loss of resolution  in making  a small  image larger. 
\ Let's see how much by redrawing the circle for comparison.
200 200 50 red circle 
s" wexpand-test.ppm" save_image 
