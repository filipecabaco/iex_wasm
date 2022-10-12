\ Color Dithering -- https://en.wikipedia.org/wiki/Floyd-Steinberg_dithering
\ Convert 24 bit true color ppm_image to 6-level-RGB.  Color range from 0-5. 
\ That is red, green, or blue values only range from 0 to 5. 
\ Image is then scaled back up with rgb equal to 255 max to save as ppm-file 
\ as expected by some simple viewing programs.
\ Here, rgb = 3 stack items (red green blue). 

include lib/graphics.4th 
include lib/palette.4th 
include lib/3dup3rot.4th 
 
: dispersion ( rgb_error rgb1 n -- rgb2 ) 
    >g  3swap                                 \ use graphics stack to 
    g@ 16 */ >r   g@ 16 */ >r  g> 16 */ >r    \ hold the dispersion size 
    rot r> +  ppm_nmax min   rot r> + ppm_nmax min   rot r> + ppm_nmax min ;
 
: reduce-pixel ( rgb -- rgb2 ) 
      color>palette palette>color  scale_pixel  ; 
 
 : dither ( -- ) to_color 
  pic_height @ 1-  0 do 
    pic_width @ 1-  0 do 
      j i pixel@   3dup reduce-pixel 3dup  j i pixel!  ( -- rgb rgb2 ) 
        >r rot r> - >r  rot swap - >r  - r> r>  3dup   ( -- rgberr rgberr ) 
      j    i 1+   pixel@  7 dispersion   j    i 1+   pixel!  3dup 
      j 1+ i 1-   pixel@  3 dispersion   j 1+ i 1-   pixel!  3dup 
      j 1+ i      pixel@  5 dispersion   j 1+ i      pixel! 
      j 1+ i 1+   pixel@  1 dispersion   j 1+ i 1+   pixel! 
     loop 
  loop ; 
 
: convert ( -- ) 
  argn 3 < abort" Usage: dither  infile outfile" 
  1 args get_image 
  dither 
  2 args save_image ; 
 
convert 

