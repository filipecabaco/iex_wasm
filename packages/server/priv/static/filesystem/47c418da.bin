\ Integer circle drawing library - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] circle    [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]
aka r@  x0
aka r'@ y0

: circle                               ( x y radius --)
  swap >r swap >r 1 over - swap 0      ( dp x y R: x0 y0)

  begin
    over x0 + over y0 +                set_pixel ( x0 + x, y0 + y)
    over x0 swap - over y0 +           set_pixel ( x0 - x, y0 + y)
    over x0 + over y0 swap -           set_pixel ( x0 + x, y0 - y)
    over x0 swap - over y0 swap -      set_pixel ( x0 - x, y0 - y)
    over y0 + over x0 +           swap set_pixel ( x0 + y, y0 + x)
    over y0 + over x0 swap -      swap set_pixel ( x0 - y, y0 + x)
    over y0 swap - over x0 +      swap set_pixel ( x0 + y, y0 - x)
    over y0 swap - over x0 swap - swap set_pixel ( x0 - y, y0 - x)
                                       ( dp x y R: x0 y0)
    1+ >r over 0> if 1- r@ over - else r@ then 2* 1+ rot + swap r>
    over over <                        ( dp x y f R: x0 y0)
  until drop drop drop r> drop r> drop
;

[DEFINED] 4TH# [IF]
  hide x0
  hide y0
[THEN]
[THEN]