\ Arc of a circle - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] arccircle [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]
[UNDEFINED] (sin)     [IF] include lib/math.4th [THEN]
                                       \ rescale and add to offset
: (xy+) 5000 + 10000 / + ;             ( n1 n2*10K -- n1+n2/10K)

\ --------------------------------------------------------
\ Paints rad2 of a circle, starting point shifted by rad1.
\ When rad1=0 the painting starts at the right, clockwise.
\ A full circle equals rad2 = 2*PI. Rad scaled by 10K.
\ --------------------------------------------------------
                                       
: arccircle                            ( x y r rad1 rad2 --)
  over + over                          ( x y r curr #points start) 
  ?do                                  ( x y r curr)
     >r >r over                        ( x y x R: curr r)
     r'@ (sin) r@ * (xy+) over         ( x y x' y R: curr r)
     r'@ (cos) r@ * (xy+) set_pixel    ( x y )
     r> r> 1+                          ( x y r cur)
  loop drop drop drop drop             ( --)
;
                                       \ returns the begin- and endpoint
: >arccircle<                          ( x1 y1 r rad1 rad2 -- x2 y2 x3 y3)
  over + 1- rot >r >r >r over          ( x y x R: r end start)
  r@ (sin) r"@ * (xy+) over            ( x y x' y R: r end start )
  r> (cos) r'@ * (xy+) 2swap           ( x2 y2 x y R: r end )
  r@ (cos) r'@ * (xy+) swap            ( x2 y2 y3 x R: r end )
  r> (sin) r>  * (xy+) swap            ( x2 y2 x3 y3)
;

[DEFINED] 4TH# [IF] hide (xy+) [THEN]
[THEN]
