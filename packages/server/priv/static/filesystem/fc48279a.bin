\ Convert 24 bit true color image to grayscale

include lib/graphics.4th
include lib/gcol2gry.4th

: convert ( -- )
  argn 3 < abort" Usage: col2gray  infile outfile"
  1 args get_image
  image>grayscale
  2 args save_image ;

convert

