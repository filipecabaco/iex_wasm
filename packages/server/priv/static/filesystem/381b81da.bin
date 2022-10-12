\ 3D turtle graphics!! 
\    Move the turtle on the z-plane to create image. 
 
include lib/gplot3d.4th
include lib/gturtle.4th
 
variable turtle_z 
0 turtle_z ! 
 
: zturtle!  ( x y z -- )   turtle_z !  turtle! ;    \ place the turtle to 3D 
: 3dplot ( x1 y1  -- x2 y2 ) turtle_z @  3d>2d ; 
' 3dplot is xdscale 
 
\ ==================================== 
300 pic_width !        \ Test it out! 
300 pic_height ! 
color_image 
255 whiteout 
                                        \ crude turtle graphics spiral. 
: spiral ( -- ) 200 0 do  i 20 /  forward 10 right  loop ; 
 
50 50 origin!   0 0 0 100 black cube              \ Create a cube to draw on. 
50 50 0 zturtle!    blue spiral                   \ Draw spiral on back face. 
0 90 0 euler!  50 50 0 zturtle!  red spiral       \ Draw spiral on side face 
0 0 0 euler!   50 50 100 zturtle! green spiral    \   and on the front face. 
 
s" spirals.ppm"  save_image
