\ Reduce in place a ppm/ppg bitmap image by 2 (drj 5/13/2012)
\ Just a simple average of 4 adjacent pixels.
\ Requires the graphics.4th library file. 

[UNDEFINED] shrink    [IF]
[UNDEFINED] set_pixel [IF]  [ABORT]  [THEN]   \ graphics.4th
 
\ Shrink current grayscale image by a factor 2 
: gray_shrink ( -- ) 
  pic_width @ 2/   0 do 
  pic_height @  2/ 0 do 
     i 2*     j 2*     pixel@ 
     i 2* 1+  j 2*     pixel@ 
     i 2*     j 2* 1+  pixel@ 
     i 2* 1+  j 2* 1+  pixel@ 
     + + +  2 + 4 /   i j pixel! 
  loop 
loop ; 
 
\ Shrink the current color image by a factor of two. 
\ Assume each pixel is represented by three integers: r g b 
: color_shrink ( -- ) 
  pic_width @ 2/   0 do 
  pic_height @  2/ 0 do 
   i 2*     j 2*    pixel@  swap rot >g >g >g  \ Reverse b g r 
   i 2* 1+  j 2*    pixel@  g> + swap g> + rot g> +  >g >g >g 
   i 2*     j 2* 1+ pixel@  g> + swap g> + rot g> +  >g >g >g 
   i 2* 1+  j 2* 1+ pixel@  g> + swap g> + rot g> + 
   4 / swap 4 / rot 4 /         \ Reverse avg back to r g b 
   i j pixel! 
  loop 
loop ; 
 
: shrink ( -- ) 
   c/pixel 1 = 
   if gray_shrink else color_shrink then ; 
 
 
[DEFINED] 4TH# [IF]
  hide gray_shrink
  hide color_shrink
[THEN]

[THEN]
