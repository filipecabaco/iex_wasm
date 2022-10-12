\ Shink heigth or width indepently to adjust the image aspect ratio. 
\  shrink or expand a ppm/pgm bitmap image along either height or width by a factor of 2.
 
[UNDEFINED] hshrink   [IF] 
[UNDEFINED] set_pixel [IF] [ABORT]  [THEN]   \ graphics.4th
[UNDEFINED] E.LIBERR  [IF] include lib/throw.4th [THEN] 
 
: color-average ( rgb1 rgb2 -- rgb3 ) 
     swap rot >r >r 
     + swap r> + rot r> + 
     2/ swap 2/ rot 2/ ; 
 
 
: gray-average ( n1 n2 -- n3 ) 
      + 2 +  2/ ; 
 
 defer pixel-average 
 
[DEFINED] 4TH# [IF] 
 :token Undefined TRUE E.LIBERR THROW" Undefined" ; 
[ELSE] 
 :noname ." Undefined" abort ; constant Undefined 
[THEN] 
 
Undefined is pixel-average 
 
: set-image-type ( -- ) 
   c/pixel 1 =  if ' gray-average else ' color-average then 
   is pixel-average ; 
 
\ ===== by height =========== 
: hshrink ( -- ) 
  set-image-type 
  pic_width @      0 do 
  pic_height @  2/ 0 do 
     i 2*       j      pixel@ 
     i 2* 1+    j      pixel@ 
     pixel-average   i j pixel! 
  loop 
 loop ; 
 
: hexpand ( -- ) 
\   set-image-type 
  pic_width @  0 do 
  0  pic_height @ 2/  do
     i j pixel@   i 2* j pixel!
     i j pixel@   i 2* 1 - j pixel!
   -1 +loop
  loop ;
 
\ ========= by width =========== 
: wshrink ( -- ) 
   set-image-type 
   pic_width @   2/ 0 do 
   pic_height @  0 do 
      i j 2*     pixel@ 
      i j 2* 1+  pixel@ 
      pixel-average   i j pixel! 
   loop 
  loop ; 
 
: wexpand ( -- ) 
\   set-image-type 
   0  pic_width @  2/ do
   pic_height @  0 do 
      i j  pixel@    i j 2*   pixel!
      i j  pixel@    i j 2* 1 - pixel! 
   loop 
  -1 +loop ; 


[DEFINED] 4TH# [IF] 
  hide color-average
  hide gray-average
  hide pixel-average
  hide set-image-type
[THEN] 
[THEN] 


