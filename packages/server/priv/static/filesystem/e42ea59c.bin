\ 4tH Sierpinski curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following Logo code:

\ TO Sierp :n :a :h :k
\ IF :n = 0 [ FD :k STOP ]
\ RT :a Sierp :n - 1 (-:a) :h :k LT :a FD :h
\ LT :a Sierp :n - 1 (-:a) :h :k RT :a
\ END

\ 4 [ Sierp 7 45 :h 10 RT 45 FD :h RT 45 ]

\ See also: https://en.wikipedia.org/wiki/Sierpi%C5%84ski_curve 

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

325 pic_width !                        \ this fills it up pretty nicely
325 pic_height !
color_image

aka r@ a
aka r'@ h
aka r"@ k

: sierp                                ( n a h k)
  >r >r >r                             ( n R: k h a)
  dup if
    1- dup a right 
    a negate h k recurse a left h forward a left
    a negate h k recurse r> right
  else
    drop k forward rdrop
  then rdrop rdrop
;

clear-screen 5 pic_width @ 5 - turtle! blue
4 0 do 7 45 8 10 sierp 45 right 8 forward 45 right loop
s" gsierp.ppm" save_image

