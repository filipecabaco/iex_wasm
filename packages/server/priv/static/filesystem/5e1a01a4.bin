include lib/gplot3d.4th

\ ======= Test=========
color_image          \ Define bitmap picture
600 pic_width ! 
400 pic_height ! 
center-plot 
255 whiteout 
magenta              \ draw a big box 
  0 0 0 euler! 
  0 0 -50  100 cube 
  0 0 -50  black axis 
green                \ draw a smaller rotated box 
  90 45 -20 euler! 
  0 0 0 50 cube 
  0 0 0  blue axis 
s" box.ppm" save_image
\ =====end of test==== 