\ Simple turtle graphics based on an PD FIG Forth screen 
\ (see pcfig4th.arc on Taygeta). 
\ 4tH library file, D Johnson (Aug 1, 2010) 
\ You can redistribute this file and/or modify it under 
\ the terms of the GNU General Public License 
 
[UNDEFINED] turtle! [IF] 
[UNDEFINED] set_pixel [IF]  [ABORT]  [THEN] 
[UNDEFINED] sin [IF] 
include lib/math.4th 
[THEN] 
 
   variable turtle_rx         variable turtle_cy 
   variable turtle_dir 
 
                   \  keep within bounds 
: fence  ( n1 lower upper -- n2 )  rot min max ; 
 
\ Utility words.  Use these 'calculated' values 
\  (can be for future manipulations) for the turtle graphics 
: turtle!  ( x y -- )  turtle_cy !  turtle_rx ! ; 
: turtle@  ( - - x y ) turtle_rx @  turtle_cy @ ; 
: compass! ( n -- )  turtle_dir ! ;  \ n degrees from 'North' 
: compass@ ( -- n )  turtle_dir @ ; 
 
\ The three (x)turtle graphics words. 
: xhome  ( -- )   pic_height @ 2/  pic_width @ 2/ 
                  turtle!   0 compass! ; 
 
                   \ Rotate; positive-n is counter clockwise. 
: xrotate ( n --) negate compass@ + 360 mod 
                  dup 0< if 360 + then  compass! ; 
 
: +goto 
    turtle@ rot - 
    0  pic_width @  fence  >r  + 
    0  pic_height @  fence  r> 
    turtle!  ; 
 
defer  xdscale 

: 2dplot ;
' 2dplot is xdscale

: xmove ( n -- )   \ Move the turtle n pixels 
    dup 0= if drop else 
       >r  turtle@ 
       compass@ cos dup 0< if abs r@ 10K */  negate 
                               else r@ 10K */  then 
       compass@ sin dup 0< if abs r> 10K */ negate +goto 
                               else r> 10K */ +goto then 
      xdscale  turtle@ xdscale  line 
   then ; 
 
 
\ Define some common turtle graphic words 
 
aka white xpenup  ( -- ) 
aka blue xpendown ( --) 
aka xmove forward ( n --) 
aka xrotate left  ( --) 
 
: clear-screen ( -- )   pic_intensity @  whiteout ; 
: back ( n -- )  negate xmove ; 
: right ( n -- ) negate xrotate ; 
 
 
[DEFINED] 4TH# [IF] 
  hide turtle_rx 
  hide turtle_cy 
  hide turtle_dir 
  hide +goto 
[THEN] 
[THEN] 
