\ Covert a grayscale image to color format.  The image
\ is still grayscale but can now in a color format so
\ that it can be minipulated as such.

include lib/graphics.4th

: convert2color ( -- )
   -1 pic_height @  1-  do
      -1 pic_width @  1-   do
         to_gray   j i pixel@
         gray>color
         to_color  j i pixel!
      -1 +loop
   -1 +loop ;

: convert ( -- )
  argn 3 < abort" Usage: gray2col  infile outfile"
  1 args get_image
  convert2color
  to_color
  2 args save_image ;

convert


