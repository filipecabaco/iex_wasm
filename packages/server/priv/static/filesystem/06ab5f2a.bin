\ Integer ellipse drawing library - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ellipse   [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]
[UNDEFINED] d+        [IF] include lib/ansdbl.4th [THEN]

variable (Px)
variable (Py)
2 array  (P)

aka r@  (Rx^2)
aka r'@ (Ry^2)
aka r"@ (Ry)

: (s>d) dup 0< negate ;                ( n -- d)
: (P+!) (s>d) (P) 2@ d+ (P) 2! ;       ( n --)

: (ellipse)                            ( x y xr yc -- x y xr yc)
  >r >r                                ( x y R: yc xr)
  over r@ + over r'@ + set_pixel       \ xc+x,yc+y
  over r@ swap - over r'@ + set_pixel  \ xc-x,yc+y
  over r@ + over r'@ swap - set_pixel  \ xc+x,yc-y
  over r@ swap - over r'@ swap - set_pixel r> r>
;                                      \ xc-x,yc-y

: ellipse                              ( xc yc Rx Ry --)
  dup >r dup * >r dup * >r 0 (Ry)      ( xc yc x y R: Ry Ry^2 Rx^2)
  0 (Px) ! dup (Rx^2) * 2* (Py) !      ( xc yc x y R: Ry Ry^2 Rx^2)
  2swap (ellipse) 2swap                ( xc yc x y R: Ry Ry^2 Rx^2)

  (Ry^2) (Rx^2) (Ry) * - (Rx^2) 4 / + (s>d) (P) 2!
  begin
    (Px) @ (Py) @ <                    ( xc yc x y f R: Ry Ry^2 Rx^2)
  while                                ( xc yc x y R: Ry Ry^2 Rx^2)
    swap 1+ swap                       ( xc yc x+1 y R: Ry Ry^2 Rx^2)
    (Ry^2) 2* (Px) +!                  ( xc yc x+1 y R: Ry Ry^2 Rx^2)
    (P) 2@ d0< if                      ( xc yc x+1 y f R: Ry Ry^2 Rx^2)
      (Ry^2) (Px) @ + (P+!)
    else                               ( xc yc x+1 y R: Ry Ry^2 Rx^2)
      1- (Rx^2) 2* negate (Py) +!
      (Ry^2) (Px) @ + (Py) @ - (P+!)
    then
    2swap (ellipse) 2swap              ( xc yc x y R: Ry Ry^2 Rx^2)
  repeat                               ( xc yc x y R: Ry Ry^2 Rx^2)

  over 2* 1+ dup * 4 / (Ry^2) *        ( xc yc x y 2x+1^2/4 R: Ry Ry^2 Rx^2)
  over 1- dup * (Rx^2) * + (Rx^2) (Ry^2) * - (s>d) (P) 2!
  begin                                ( xc yc x y R: Ry Ry^2 Rx^2)
    dup 0>                             ( xc yc x y f R: Ry Ry^2 Rx^2)
  while                                ( xc yc x y R: Ry Ry^2 Rx^2)
    1- (Rx^2) 2* negate (Py) +!
    0. (P) 2@ d< if                    ( xc yc x y R: Ry Ry^2 Rx^2)
      (Rx^2) (Py) @ - (P+!)
    else                               ( xc yc x y R: Ry Ry^2 Rx^2)
      swap 1+ swap                     ( xc yc x+1 y R: Ry Ry^2 Rx^2)
      (Ry^2) 2* (Px) +!
      (Rx^2) (Px) @ + (Py) @ - (P+!)
    then
    2swap (ellipse) 2swap              ( xc yc x y R: Ry Ry^2 Rx^2)
  repeat                               ( xc yc x y R: Ry Ry^2 Rx^2)

  drop drop drop drop r> drop r> drop r> drop
;                                      ( --)

[DEFINED] 4TH# [IF]
  hide (P)
  hide (P+!)
  hide (Px)
  hide (Py)
  hide (Rx^2)
  hide (Ry^2)
  hide (Ry)
  hide (ellipse)
  hide (s>d)
[THEN]
[THEN]
