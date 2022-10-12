\ 4tH Hilbert curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: https://en.wikipedia.org/wiki/Hilbert_curve

\ Based on the following Logo code:

\ TO Hilb :n :a :h
\ IF :n = 0 [ STOP ]
\ RT :a Hilb :n - 1 (-:a) :h FD :h
\ LT :a Hilb :n - 1 :a :h 
\ FD :h Hilb :n - 1 :a :h LT :a
\ FD :h Hilb :n - 1 (-:a) :h RT :a
\ END

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

580 pic_width !                        \ this fills it up pretty nicely
580 pic_height !
color_image
                                       \ use return stack as registers
aka r"@ h
aka r'@ a
aka r@  n

: hilbert                              ( n a h --)
  >r >r >r
  n if
    a right   n 1- a negate h recurse h forward
    a left    n 1- a        h recurse
    h forward n 1- a        h recurse a left
    h forward n 1- a negate h recurse a right 
  then rdrop rdrop rdrop               \ clear the return stack
;

clear-screen 5 pic_width @ 5 - turtle!
red 6 90 9 hilbert
s" ghilbert.ppm" save_image

