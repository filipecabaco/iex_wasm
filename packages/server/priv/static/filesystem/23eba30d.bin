\ Convert the current 24 bit true color image  as defined 
\ in graphics.4th to grayscale   (drj: May 2012)

[UNDEFINED] image>grayscale [IF]
[UNDEFINED] set_pixel [IF]  [ABORT]  [THEN]   \ graphics.4th

: image>grayscale ( -- )
  c/pixel 1 > if 
    pic_height @  0  do   
        pic_width @  0  do
           to_color  j i pixel@
           color>n
           to_gray  j i pixel!
        loop
    loop 
    to_gray
  then 
  ;
  
[THEN]  



