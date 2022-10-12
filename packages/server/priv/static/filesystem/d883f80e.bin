\ 4tH Spirograph (tm) generator - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ ***************************************************
\ Spirograph is a registered trademark of Hasbro Inc.
\ ***************************************************

include lib/math.4th
include lib/gcdlcd.4th
include lib/enter.4th
include lib/3dup3rot.4th
include lib/graphics.4th

: round dup 0< >r abs 10K 2 / + 10K / r> if negate then ;
: >x over over (cos) * >r * swap / (cos) * r> + round ;
: >y over over (sin) * >r * swap / (sin) * r> - round ;
                                       ( c b a-b t*10K)
: hypotrochoid                         ( a b c)
  >r over over tuck 2* PI*10K * >r gcd r> swap /
  r> swap >r -rot tuck -               ( c b a-b)
  r> 0 ?do
     3dup i  >y ppm_height 2 / + i swap >r >r
     3dup r> >x ppm_height 2 / + r> set_pixel
     i' i - 10K 10 * /mod swap if drop else . ." cycles remaining.." cr then
  loop 3drop
;
                                       \ set canvas size
ppm_height dup pic_width ! pic_height ! 
color_image 255 whiteout blue          \ paint blue on white
." Radius of outer circle: " enter
." Radius of inner circle: " enter
." Distance              : " enter
' hypotrochoid catch abort" Cannot generate image"
s" gspiro.ppm" save_image ." Image saved." cr

\ Some values to play with:
\ 240,70,90;200,10,100;100,10,100;30,125,170;30,64,170;360,438,174
\ 240,140,100;150,90,150;160,28,60;168,98,100;210,98,100
