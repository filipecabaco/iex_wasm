\ Color palette: 6-level-RGB.  Color range from 0-5
\ and the palette number is given by 36*red + 6*green + blue
\ with a maximum value of 215.  Conversion is saved in a .pgm
\ format grayscale image  which can be viewed as a funky
\ grayscale image. Ref: "List of Software Palettes," Wikipedia

include lib/graphics.4th
include lib/palette.4th

: convert2palette ( -- )
pic_height @   0    do
  pic_width @      0   do
      to_color  j i pixel@
      color>palette
      to_palette j i pixel!
     loop
  loop ;

: convert ( -- )
  argn 3 < abort" Usage: col2pal  infile.ppm outfile.pgm"
  1 args get_image
  convert2palette
  palette_image
  2 args save_image ;

convert






















































































