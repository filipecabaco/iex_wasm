\ Draw a smiley - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/graphics.4th
include lib/garccirc.4th

600 pic_width ! 600 pic_height ! color_image 0 whiteout

white 300 300 299 0  PI*10K 2* arccircle
green 200 175  75 0  PI*10K 2* arccircle
blue  200 425  75 0  PI*10K 2* arccircle
red   300 300 200 PI*10K 5 / PI*10K dup dup + 5 / - arccircle
300 300 200 PI*10K 5 / PI*10K dup dup + 5 / - >arccircle< line
s" smile.ppm" save_image ." Image saved." cr

