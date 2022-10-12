\ Covert 6 level RGB color palette image back into a "raw" ppm color file.
\ Reference: "List of Software Palettes," Wikepedia

include lib/graphics.4th
include lib/palette.4th

: convert2color ( -- )
   -1 pic_height @  1-  do
      -1 pic_width @  1-   do
         to_palette   j i pixel@
         palette>color
         scale_pixel
         to_color j i pixel!
      -1 +loop
   -1 +loop ;

: convert ( -- )
  argn 3 < abort" Usage: pal2col  infile outfile"
  1 args get_image
  convert2color
  color_image
  2 args save_image ;

convert








































