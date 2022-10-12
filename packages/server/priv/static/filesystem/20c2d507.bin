\ 3D plotter in 4tH
\ for the function (SIN (SQRT (x^2 + y^2))) / SQRT (x^2 + y^2)
\ David Johnson and Hans Bezemer, 6/6/2015
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License. 

include lib/gplot3d.4th                \ include the 3D library
include lib/isqrt.4th                  \ include fast integer SQRT

100000 constant 100K                   \ scaling constant

400 pic_width !                        \ set dimensions
400 pic_height !
center-plot                            \ center the plot

[UNDEFINED] 3Dview [IF] 0 constant 3Dview [THEN]

       3Dview 1 [=] [IF]               \ different views!
   0 0 0 euler!                        \ Select with:
[ELSE] 3Dview 2 [=] [IF]               \   pp4th -x -D3Dview=x <file>
  20 20 20 euler!
[ELSE] 3Dview 3 [=] [IF]
  0 -90 0 euler!
[ELSE] 3Dview 4 [=] [IF]
 90 0 0 euler!
[ELSE] 3Dview 5 [=] [IF]
 -45 -45 0 euler!
[ELSE]
  90 -90 225 euler!                    \ default viewpoint
[THEN] [THEN] [THEN] [THEN] [THEN]

-100 -100 -100 200 cube                \ draw a 3D cube

201 -200 do                            \ now calculate all pixels
  201 -200 do 
     i j or if                         \ prevent division by zero!
       i 2/ j 2/ i i * j j * + 
       10K * isqrt dup 10 * (sin) 10K
       * swap /  40000 +  142 * 100K / 100 -
       3d>2d set_pixel                 \ plot the pixel in 3D
     then
  2 +loop 
2 +loop 

s" 3ddemo.ppm" save_image              \ and save the image
