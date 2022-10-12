include lib/graphics.4th
include lib/gturtle.4th
include lib/gbanner.4th

: circle ( -- )
    36 0 do  3 xmove 10 xrotate  loop ;

s" pic1.ppm"  get_image
cr image_comment$ count type
cr ." File read!" cr

250 250 turtle!  green circle

green horizontal text_down
260 250 s"  green circle" gbanner

s" pic2.ppm"  save_image
cr ." New file saved!" cr
