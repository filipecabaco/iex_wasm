\ Digital differential analyzer - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This library member is intended to be interfaced with another
\ library. It will feed an x,y coordinate to the hook. The callback
\ function determines whether and how a pixel will be painted. 

[UNDEFINED] hypotenuse [IF]
[UNDEFINED] set_pixel  [IF] [ABORT] [THEN]
defer (dda)                            ( x y --)
                                       \ returns #pixels to be written
: hypotenuse                           ( x1 y1 x2 y2 -- x1 y1 x2 y2 h)
  >r swap >r                           ( x1 x2 R: y2 y1)
  over over - abs                      ( x1 x2 dx R: y1 y2)
  r@ r'@ - abs max                     ( x1 x2 len R: y2 y1)
  r> -rot r> swap                      ( x1 y1 x2 y2 len)
;

: dda                                  ( x1 y1 x2 y2 xt --)
  is (dda) rot >r >r over -            ( x1 dx R: y1 y2)
  r> r@ - over abs over abs max        ( x1 dx dy step R: y1)
  dup unless drop drop drop r> (dda) ;then
  >r 16 lshift r@ /                    ( x1 dx dy' R: y1 step)
  swap 16 lshift r@ / swap             ( x1 dx' dy' R: y1 step)
  rot 16 lshift r> r> 16 lshift        ( dx' dy' x1 step y1) 
  swap 0 ?do                           ( dx' dy' x1 y1)
    >r >r                              ( dx' dy' R: y1 x1)
    r@ 1+ 16 rshift r'@ 1+ 16 rshift (dda)
    over r> + over r> +                ( dx' dy' x' y')
  loop drop drop drop drop
;

[DEFINED] 4TH# [IF] hide (dda) [THEN]
[THEN]
