include lib/gplot3d.4th
 
: fnz ( x y ) 
     >r dup *    r> dup *   +  50 /  ; 
 
: plot-slice ( n -- ) 
    -51 50 do dup i 2dup fnz 3d>2d set_pixel -1 +loop drop ; 
 
: plot ( -- ) 
      -51 50 do i  plot-slice -1 +loop ; 
 
color_image 
255 whiteout 
0 0 0 euler! 
-75 -75 0  150 red cube 
blue plot 
-100 -100 -20 magenta axis 
s" out1.ppm" save_image 
 
 
255 whiteout 
90 45 0 euler!    \ Change orientation 
-75 -75 0  150 red cube 
blue plot 
-100 -100 -20 magenta axis 
s" out2.ppm" save_image
