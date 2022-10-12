\ 4tH Grate curve - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following Logo code:

\ TO TWO :a :c :w
\ IF :c < 1 [ STOP ]
\ RT :a FD 1 RT :a FD :w LT :a IF :c > 1 [FD 1]
\ LT :a FD :w TWO :a :c - 2 :w
\ END

\ TO Square :a :h :w
\ FD :w TWO :a :h - 1 :w
\ END

\ TO Cag :n :a :w :h
\ IF :n = 0 [ Square :a :h :w STOP ]
\ RT :a Cag :n - 1 (-:a) :h/4 :w FD :h/8
\       Cag :n - 1   :a  :h/4 :w FD :h/8
\       Cag :n - 1 (-:a) :h/4 :w LT :a
\ END

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

600 pic_width !                        \ this fills it up pretty nicely
600 pic_height !
color_image
                                       \ use return stack as registers
: two                                  ( a c w)
  >r >r >r                             ( r: w c a)
  r'@ 0> if
    r@ right 1 forward r@ right r"@ forward r@ left
    r'@ 1 > if 1 forward then
    r@ left r"@ forward r> r> 2 - r> recurse
  ;then rdrop rdrop rdrop
;  

: square                               ( a h w)
  dup forward >r 1- r> two
;

: cag                                  ( n a w h)
  >r >r >r                             ( n R: h w a)
  dup if
    r@ right 1- 
    dup r@ negate r"@ 4 / r'@ recurse r"@ 8 / forward
    dup r@        r"@ 4 / r'@ recurse r"@ 8 / forward
        r@ negate r"@ 4 / r'@ recurse r> left rdrop rdrop
  ;then drop r> r> r> square
;

clear-screen 5 pic_width @ 5 - turtle!
red 4 90 599 599 cag
s" grate.ppm" save_image

