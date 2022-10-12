\ 4tH Antenna tree - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Based on the following Logo code:

\ TO Tr :n :h
\ IF :n = 0 [ STOP ]
\ FD :h LT 90
\ Tr :n - 1 (:h * 0.7071) LT 90 FD 2 * :h LT 90
\ Tr :n - 1 (:h * 0.7071) LT 90 FD :h
\ END
\ Tr 10 120

include lib/graphics.4th
include lib/gturtle.4th                \ obvious choice when converting LOGO

400 pic_width !                        \ this fills it up pretty nicely
500 pic_height !
color_image

: antenna                              ( n h)
  swap dup if                          ( h n)
    1- over forward 90 left
    over 72 * 100 / stow recurse 90 left over 2* forward 90 left
    over 72 * 100 / stow recurse 90 left over forward
  then drop drop                       \ 72/100 = approx. 1/sqrt(2)
;

clear-screen 250 200 turtle! blue
10 120 antenna
s" gantenna.ppm" save_image

