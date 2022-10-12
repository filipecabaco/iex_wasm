
\ Simple 3D plotter in 4tH 
\ For use with graphics.4th     
\ David Johnson and Hans Bezemer, 6/4/2015 
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License. 
 
\ Main user words 
\ ============================================================================ 
\  origin! ( x y -- ) set the location of plot origin within the image. 
\  center-plot ( -- ) set the xy origin at the image center. 
\  euler! ( phi1 psi phi2 -- )  Set Euler angles to define plot orientation. 
\  xyznew ( xold yold zold -- x y z )   Do the coordinate transformation. 
\  3d>2d ( rx cy z1 -- rx cy )  Map x,y,z to 2-D for the graphic.4th wordset 
\  axis ( x y z  -- )    Draw the current axis orientation at point xyz. 
\  cube ( x y z size -- ) Draw a cube at xyz. 
\  mirror-left ( -- )    When mapping from 3d to 2d use the "left" version of the cube.
\  mirror-right ( -- )   Use the "right" mirror version of the cube (default condition)
\ ============================================================================= 
 
\ Note about the Euler angles: 
\    phi1 = rotation about the z-axis 
\    psi  = rotation about the new x-axis 
\    phi2 = rotation about the newest z-axis 
\        Use postive angles for counter-clockwise rotations. 

[UNDEFINED] euler!   [IF] 
[UNDEFINED] cos      [IF] include lib/math.4th     [THEN]  \ integer trig 
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th    [THEN]  \ THROW codes
[UNDEFINED] line     [IF] include lib/graphics.4th [THEN]  \ PPM graphics 
[UNDEFINED] gbanner  [IF] include lib/gbanner.4th  [THEN]  \ text graphics 
 
 
\ ==Image size is taken from graphics.4th== 
\ Note (0,0) = top left of image 
\ rows = x  and is related to the image height (pic_height) 
\ columns = y and is related to the image width (pic_width) 
 
variable  yorg   \ Define the plot origin based on the 
variable  xorg   \ image size defined in graphics.4th 
 
: origin! ( x y -- )  yorg !  xorg ! ; 
: center-plot ( -- )  pic_height @ 2/   pic_width @ 2/  origin! ; 
 
 center-plot  \ initialize with default values from graphics.4th 
 
\  Rotation Matrices 
9 array [A] does> rot 1- 3 * rot 1- + cells + ;   \ define 3x3 matrices 
9 array [B] does> rot 1- 3 * rot 1- + cells + ;   \ with origin at [1,1] 
9 array [C] does> rot 1- 3 * rot 1- + cells + ; 
 
: PHI  ( angle -- ) >r     \ Matrix for rotation about z-axis 
   r@ cos  1 1 [A] !              r@ sin  1 2 [A] !     0  1 3 [A] ! 
   r@ sin  negate 2 1 [A] !       r> cos  2 2 [A] !     0  2 3 [A] ! 
      0    3 1 [A] !                 0    3 2 [A] !   10K  3 3 [A] ! ; 
 
: PSI ( angle -- )  >r      \ Matrix for rotation about x-axis 
   10K   1 1 [B] !         0  1 2 [B] !                 0  1 3 [B] ! 
     0   2 1 [B] !    r@ cos  2 2 [B] !             r@ sin 2 3 [B] ! 
     0   3 1 [B] !    r@ sin  negate 3 2 [B] !     r> cos  3 3 [B] ! ; 
 
\ Calculate rotation matrix using the three Euler angles 
\   Rotation Matrix = R(phi2)*R(psi)*R(phi1) where 
\      R(phi1) is a rotation of phi1 about the z-axis 
\      R(psi)  is a rotation of psi about the new x-axis 
\      R(phi2) is a rotation of phi2 about the newest z-axis 
 


defer [MA]   \ The matrix multiplication is done in terms of 
defer [MB]   \ these deferred matrices 
defer [MC] 
 
[DEFINED] 4TH# [IF] 
 :token Undefined TRUE E.LIBERR THROW" Deferred matrix is undefined" ;
[ELSE] 
 :noname ." Deferred matrix is undefined" abort ; constant Undefined
[THEN] 
 
Undefined dup dup is [MA] is [MB] is [MC]
 

: ab  ( i k  -- n )       \ Compute matrix element[i,k] = Aij Bjk 
     swap 0               \ dummy indices to the graphic stack 
     4 1 do -rot over over i [MA] @   ( n k i Aij ) 
        i rot [MB] @                  ( n k i Aij Bjk ) 
        10K */  >r rot r> +           \ sum over the j-index 
     loop  nip nip ;                  \ clean up 
 
: ab2c ( i  -- )          \ Compute ith row of the matrix 
    4 1 do dup i ab over i [MC] !  loop
    drop ;
 
: a*b=c ( 'A 'B 'C -- )   \ Matrix [3x3] multiplication 
    is [MC]  is [MB]  is [MA] 
    4 1 do i ab2c loop ; 
 
: euler ( phi1 psi phi2 -- )        \ Apply three Euler angles with the 
      rot PHI  swap PSI             \ final rotation matrix placed 
      ' [B]  ' [A]  ' [C]  a*b=c    \ in matrix [B] 
      PHI 
      ' [A]  ' [C]  ' [B]  a*b=c ; 
 
variable phi1    0 phi1 !         \ Keep track of the Euler angles 
variable xpsi    0 xpsi !         \ during the plotting. 
variable phi2    0 phi2 ! 
 
: euler! ( phi1 psi phi2 -- )  phi2 ! xpsi !  phi1 ! ; 
 
 
: xyznew ( xold yold zold -- x y z )    \ Do coordinate transformation 
    phi1 @  xpsi @  phi2 @  euler       \   rotation matrix is now [B] 
    1 3 [C] !   1 2 [C] !  1 1 [C] !    \   place vector in [C] 
    ' [C] is  [MA]                      \ Work in terms of the 
    ' [B] is  [MB]                      \   deferred matrices. 
    1 1 ab  1 2 ab  1 3 ab ;            \ Multiply [C] vector and [B] matrix 
 
 
1 value mirror
: mirror-right ( - - )  1 to mirror ;
: mirror-left ( -- )   -1 to mirror ;

: 3d>2d ( rx cy z1 -- rx cy )           \ Map the x,y,z point to 2-D image 
       xyznew 
       100 141 */        \ divide by root(2) 
       >r   swap 
       xorg @   r@  + +  swap 
       yorg @   r>  mirror *    + +  ; 
 
20 constant  _xyzlen     \ define length of coordinate axis
30 constant  _xyztext    \ define where to place text on axes

: +under ( a b c -- a+c b ) rot + swap ;

: axis  ( x y z  -- )    \ Draw the axis orientation at point xyz
  2>r dup 2r@ rot >r 3d>2d
                         \ calculate point of origin
  2dup r> dup _xyzlen  + swap 2r@ rot >r 3d>2d line
       r> dup _xyztext + swap 2r@ rot >r 3d>2d s" X" gbanner
                         \ draw X-axis
  2dup r> dup 2r@ _xyzlen  +under rot >r 3d>2d line
       r> dup 2r@ _xyztext +under rot >r 3d>2d s" Y" gbanner
                         \ draw Y-axis
       r> dup 2r@ _xyzlen  +      rot >r 3d>2d line
       r>     2r> _xyztext +             3d>2d s" Z" gbanner ;
                         \ draw Z-axis

: zbox ( x y z length -- )  \ draw a box in the z-plane
   >r >r
   2dup r@                  3d>2d 2over r'@ +under       r@ 3d>2d line
   2dup r'@ +under r@       3d>2d 2over r'@ +under r'@ + r@ 3d>2d line
   2dup r'@ +under r'@ + r@ 3d>2d 2over            r'@ + r@ 3d>2d line
   2dup r> r> swap >r  + r@ 3d>2d 2swap                  r> 3d>2d line
;

: zline ( x y z length -- )   \ draw line parallel to z-axis in y-plane 
   >r >r 
      2dup   r@        3d>2d
      2swap  r>  r> +  3d>2d line ;

: cube ( x y z size -- ) 
   >r >r
       2dup                   r@          r'@  zbox 
       2dup                   r@  r'@ +   r'@  zbox 
       2dup                   r@          r'@  zline 
       over r'@ + over        r@          r'@  zline
   2dup r'@ +                 r@          r'@  zline
   r'@ + r'@ +under           r>          r>   zline ;

[DEFINED] 4TH# [IF] 
  hide xorg 
  hide yorg 
  hide [A] 
  hide [B] 
  hide [C] 
  hide PHI 
  hide PSI 
  hide [MA] 
  hide [MB] 
  hide [MC] 
  hide Undefined 
  hide ab 
  hide ab2c 
  hide a*b=c 
  hide euler 
  hide phi1 
  hide xpsi 
  hide phi2 
  hide _xyzlen
  hide _xyztext
  hide zbox 
  hide zline
  hide +under
  hide mirror
[THEN] \ ====undefine private======================
[THEN] \ ====undefined euler!======================
