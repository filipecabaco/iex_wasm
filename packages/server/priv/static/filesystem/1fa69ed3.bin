\ 4tH Wirth curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following Logo code:

\ TO wi :n :a :h :k
\ IF :n = 0 [ FD :h STOP ]
\ RT :a iw :n (-:a) :h :k LT :a FD :h
\ LT :a iw :n (-:a) :h :k RT :a
\ END

\ TO iw :n :a :h :k
\ RT :a wi :n - 1 (-:a) :h :k FD :k LT 2 * :a
\ FD :k wi :n - 1 (-:a) :h :k RT :a
\ END

\ REPEAT 4 [ wi 4 45 7 3 FD 3 RT 90 FD 3 ] 

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO
include lib/gflood.4th

325 pic_width !                        \ this fills it up pretty nicely
325 pic_height !
color_image

aka r@ a
aka r'@ h
aka r"@ k

defer iw

: wi                                   ( n a h k)
  >r >r >r                             ( n R: k h a)
  dup if
    a right dup 
    a negate h k iw a left h forward a left
    a negate h k iw r> right
  else
    drop h forward rdrop
  then rdrop rdrop
;

:noname                                ( n a h k)
  >r >r >r                             ( n R: k h a)
  1- dup a right  
  a negate h k wi k forward a 2* left k forward
  a negate h k wi r> right rdrop rdrop
; is iw

clear-screen 5 pic_width @ 5 - turtle! black
4 0 do 4 45 7 3 wi 45 3 forward 90 right 3 forward loop
red 150 150 flood
s" gwirth.ppm" save_image 

