\ 4tH Knuth curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following Logo code:

\ TO Knu :n :a :t :h
\ IF :n = 0 [ RT 45 + :t FD :h LT 45 + :t STOP ]
\ RT 2 * :t + :a Knu :n - 1 2 * :t (-:t) :h
\ RT 45 - 3 * :t - :a FD :h LT 45 - :t + :a
\ Knu :n - 1 0 (-:t) :h RT :a
\ END

\ LT 90 Knu 9 -90 45 8

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

250 pic_width !                        \ this fills it up pretty nicely
500 pic_height !
color_image

aka r@ a
aka r'@ t
aka r"@ h

: knuth                                ( n a t h)
  >r >r >r                             ( n R: h t a)
  dup if
    1- dup t 2* a + right 
    t 2* t negate h recurse 
    45 t 3 * - a - right h forward 45 t - a + left 
    0 t negate h recurse a right
  else
    drop 45 t + right h forward 45 t + left
  then rdrop rdrop rdrop
;

clear-screen 2 pic_width @ 2 - turtle! blue
9 -90 45 8 Knuth
s" gknuth.ppm" save_image

