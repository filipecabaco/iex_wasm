\ Circle drawing demo - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/graphics.4th
include lib/gcircle.4th

640 pic_width !                        \ width of the image
480 pic_height !                       \ height of the image

blue 255 whiteout                      \ white background
240 320 set_pixel                      \ mark centre

240 10 ?do 240 320 i circle 10 +loop   \ draw concentric circles

s" circle.ppm" save_image              \ done, save the image
