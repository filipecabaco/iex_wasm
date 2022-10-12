\ Clelia curve generator - Copyright 2020  D.Johnson and J.L. Bezemer 
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License 
 
include lib/math.4th 
include lib/enter.4th 
include lib/3dup3rot.4th 
include lib/gplot3d.4th 

\ ***************************************************************
\ This program is for entertainment and educational purposes only
\ ***************************************************************
 
/cell 4 - constant 64bit               \ is this a 64bit platform? 
 
: round dup 0< >r abs 10K 2 / + 10K / r> if negate then ; 
 
64bit [IF] 
: >x ( R n t -- x )  dup 10K * (cos) -rot * (cos) * * 10K / round ; 
: >y ( R n t -- y )  dup 10K * (sin) -rot * (cos) * * 10K / round ; 
: >z ( R n t -- z )  * (sin) * round ; 
[ELSE] 
include lib/mixed.4th                  \ we're using mixed words in 32bit 
                                      .( This takes some time. Be patient!) cr 
: *2pi% m* pi*10k 2* sm/rem drop ;     \ multiply and mod 2PI 
: *10K*/ m* rot 10K m*/ d>u ;          \ multiply and scale down 10K 
 
: >x ( R n t -- x )  dup 10K * (cos) -rot *2pi% (cos) *10K*/ round ; 
: >y ( R n t -- y )  dup 10K * (sin) -rot *2pi% (cos) *10K*/ round ; 
: >z ( R n t -- z )  *2pi% (sin) * round ; 
[THEN] 
 
: >clelia ( R n t -- x y z ) 3dup >z >r  3dup >y >r  >x r> r> ; 
 
: clelia ( R n -- )                    \ n is a 10K value 
   pi*10k 8 / 0  do 
     2dup i >clelia 3d>2d set_pixel 
   loop 2drop ; 
 
140 constant Radius                    \ radius of sphere 
                                       \ set canvas size 
ppm_height dup pic_width ! pic_height ! 
color_image 255 whiteout black         \ paint on white background 
 
center-plot                            \ setup -- sphere in box 
-90 90 ." z-rotation: " enter  euler! 
 
." Integer p-value: " enter  10K * 
." Integer q-value: " enter   / 
." Value of  n = p/q * 10K is " dup . cr >r
 
radius negate dup dup radius 2* cube 
0 0 0 black axis 
Radius 25 10K *  blue clelia r>        \ the sphere 
Radius swap red ' clelia catch abort" Cannot generate image" 
s" clelia.ppm" save_image ." Image saved." cr 
 
 
\ Values of  z-rotation p  and  q  to try: 
\ ======================================================== 
\              45       1       1     Viviani's curve 
\               0       2       1     Seams of a tennis ball 
\              60   3,5,7...    1     ok 
\              30   2,4,6...    1     ok 
\              45   1,3,5,7,9   2     ok 
\               0   1,2,4,5,7   3     Noisy 
\               0   1,3,5,7,9   4     ok 
\               0   1,2,3,4,6   5     ok 
