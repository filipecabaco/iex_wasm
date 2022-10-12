\ 4tH polyspiral - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/graphics.4th
include lib/glines.4th
include lib/math.4th
include lib/enter.4th

600 pic_width ! 600 pic_height ! color_image 
pic_intensity @ 3 * 4 / whiteout

250 dup 10 0                           ( x y len angle)
." Enter angle (60-90 deg): " enter 60 max 90 min

100 0 do
  >r >r >r                             ( x y r: incr angle len)
  over r'@ cos r@ * 10K 2 / + 10K / +
  over r'@ sin r@ * 10K 2 / + 10K / + 
  2dup 2>r rainbow 2r>
  
  r> 3 + r> r@ + r>
loop drop drop drop drop drop

s" polyspir.ppm" save_image



