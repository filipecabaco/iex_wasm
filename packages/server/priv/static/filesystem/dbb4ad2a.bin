\ 4tH Peano curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ See: https://en.wikipedia.org/wiki/Peano_curve

\ Based on the following Logo code:

\ TO Pean :n :a :h
\ IF :n = 0 [STOP]
\ RT :a Pean :n - 1 (-:a) :h
\ FD :h Pean :n - 1 :a :h
\ FD :h Pean :n - 1 (-:a) :h
\ LT :a
\ END

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

490 pic_width !                        \ this fills it up pretty nicely
490 pic_height !
color_image
                                       \ use return stack as registers
aka r"@ h
aka r'@ a
aka r@  n

: peano                                ( n a h --)
  >r >r >r
  n if
    a right   n 1- a negate h recurse
    h forward n 1- a        h recurse
    h forward n 1- a negate h recurse
    a left
  then rdrop rdrop rdrop               \ clear the return stack
;

clear-screen 5 pic_width @ 5 - turtle!
red 8 90 6 peano
s" gpeano.ppm" save_image

