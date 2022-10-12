\ Drunkard's stumble
include lib/gmkiss.4th
include lib/graphics.4th
include lib/gturtle.4th
include lib/gbanner.4th

: xrnd ( -- n )  kiss 100 mod 25 / ;  \ gives -3 to 3
: stumbles ( nsteps -- )
         0 do
           xrnd 90 * xrotate
           10 xmove
         loop ;

 randomize
 color_image
 500 pic_width !  500 pic_height !
 xhome
 turtle@  s" Start" green gbanner
 white  1000 stumbles
 turtle@  s" End" red gbanner
 s" xpath.ppm" save_image











