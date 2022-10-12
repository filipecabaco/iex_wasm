include lib/graphics.4th
include lib/gturtle.4th
include lib/gbanner.4th

: spiral ( -- )
    360 0 do  i 20 /  xmove  -10 xrotate  loop ;

: box ( -- )
    4 0 do 30 xmove  90 xrotate  loop ;

                     \ Define a 300 x 300 bitmap
\ Pick one
\ =================
   color_image
\  grayscale_image
\ =================

300 pic_width !
300 pic_height !

\ Draw the image

 pic_intensity @  2 3 */  whiteout
 black horizontal text_up  10 50 s" simple shapes!"
 gbanner

 xhome red spiral
 50 37  turtle!  blue box

 blue vertical text_down
 87 20 s"  blue box" gbanner
 s" pic1.ppm" save_image

cr ." File saved!" cr


