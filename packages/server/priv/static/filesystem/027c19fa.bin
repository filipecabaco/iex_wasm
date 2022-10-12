\ BigForth version, 2009 by Ian Osgood
\ 4tH version, 2012 by Hans Bezemer

include lib/graphics.4th
include lib/gturtle.4th

2 constant dragon-step

: dragon ( depth dir -- )
  over if 
    dup   right over 1-  45 recurse
    dup 2* left over 1- -45 recurse
    right drop
  else
    dragon-step forward 2drop
  then
;

150 pic_width !
210 pic_height !
color_image

clear-screen 50 95 turtle!
xpendown 13 45 dragon
s" dragon.ppm" save_image