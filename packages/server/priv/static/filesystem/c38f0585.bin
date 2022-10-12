\ Convert 24 bit true color image to black and white image
\ using Floyd-Steinberg_dithering.  Image scaled to standard pgm 
\ format using (255 0) instead of pgb format (1 0) for easy viewing.
 
include lib/graphics.4th 
include lib/gcol2gry.4th 
 
: reduce-pixel ( n1 -- n2 )  128 > if 255 else 0 then ; 

: dither ( -- )
  pic_height @ 1-  0 do 
    pic_width @ 1-  0 do 
        j i pixel@   dup reduce-pixel     ( -- old new ) 
        dup j i pixel!  -                 ( old new -- error ) 
                                  \  Floyd–Steinberg dithering 
        j    i 1+  pixel@  over 7 16 */ +  j i 1+     pixel! 
        j 1+ i 1-  pixel@  over 3 16 */ +  j 1+ i 1-  pixel! 
        j 1+ i     pixel@  over 5 16 */ +  j 1+ i     pixel! 
        j 1+ i 1+  pixel@  swap 1 16 */ +  j 1+ i 1+  pixel! 
     loop 
  loop ;

: convert ( -- ) 
  argn 3 < abort" Usage: bwdither  infile outfile" 
  1 args get_image 
  image>grayscale  dither 
  2 args save_image ; 
 
convert 
 
