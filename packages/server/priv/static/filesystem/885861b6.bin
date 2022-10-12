\ 4tH library - Quadratic Bezier curves - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ A Bezier curve is defined by a set of control points P0 through Pn,
\ where n is called its order (n = 1 for linear, 2 for quadratic, etc.).
\ The FIRST and LAST control points are always the end points of the curve;
\ In most cases the intermediate control point DOES NOT lie on the curve,
\ but it may lay OUTSIDE the actual canvas.

\ Based on the following algorithm:

\ int getPt( int n1 , int n2 , float perc )
\ {
\     int diff = n2 - n1;

\     return n1 + ( diff * perc );
\ }    

\ for( float i = 0 ; i < 1 ; i += 0.01 )
\ {
\     // The Green Line
\     xa = getPt( x1 , x2 , i );
\     ya = getPt( y1 , y2 , i );
\     xb = getPt( x2 , x3 , i );
\     yb = getPt( y2 , y3 , i );

\     // The Black Dot
\     x = getPt( xa , xb , i );
\     y = getPt( ya , yb , i );

\     drawPixel( x , y , COLOR_RED );
\ }

\ Typical use:
\   PstartX PstartY PcontrolX PcontrolY PendX PendY bezier

\ e.g. 10 0 0 1000 500 0 bezier

[UNDEFINED] bezier    [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]
[UNDEFINED] 3dup      [IF] include lib/3dup3rot.4th [THEN]

10000 constant (#step)                 \ number of steps
                                       ( n1 n2 n3 -- n4)
: (GetPt) >r over - r> * swap (#step) * + 100 / ;
: (>x|y) >r stow r@ (GetPt) >r r'@ (GetPt) r> r> (GetPt) 5000 + 10000 / ;
                                       ( n1 n2 n3 -- n4)
: bezier                               ( x1 y1 x2 y2 x3 y3 --)
  >r swap >r rot r> r>                 ( x1 x2 x3 y1 y2 y3)
  (#step) 1+ 0 ?do                     \ calculate #step points
    3dup i (>x|y) i swap >r >r 3over r> (>x|y) r> set_pixel
  loop 3drop 3drop                     \ and plot them
;

[DEFINED] 4TH# [IF]
  hide (#step)
  hide (GetPt)
  hide (>x|y)
[THEN]
[THEN]

\ 800 pic_width ! 600 pic_height ! color_image 255 whiteout black
\ 10 0 0 1000 500 0 bezier red 15 15 flood s" test.ppm" save_image depth .

