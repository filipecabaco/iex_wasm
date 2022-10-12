\ Turtle graphics examples from Dr. Wonyong Koh's hForth.
\ Source: hf86v099.zip on Taygeta ftp site.
\ Modified here for 4tH.

include lib/graphics.4th
include lib/gturtle.4th
include lib/gbanner.4th


\ Set up the demo words
: arcr1   ( step times  -- )
        0 do   5 right   dup forward  5 right   loop   drop ;

: arcr   ( radius degrees -- )
        swap  355 2034 */
        dup >r
        over  10 /
        arcr1
        10 mod
        dup r>
        *  10 /  forward
        right  ;

: circler ( radius -- )   360 arcr ;

: arcl1   ( step times  -- )
        0 do   5 left   dup forward  5 left   loop   drop ;

: arcl     ( radius degrees -- )
        swap  355 2034 */
        dup >r
        over  10 /
        arcl1
        10 mod
        dup r>
        *  10 /  forward
        left  ;

: circlel ( radius -- )   360 arcl ;

: square   ( size -- )
        4 0  do   dup forward   90 right   loop   drop ;

: boxes   ( -- )
        10 square  20 square  30 square  40 square ;

: diamonds   ( -- )
        45 right
        4 0 do  boxes  90 right  loop ;

: flag   ( size -- )
        dup forward  dup square  back ;

: 6flag   ( size -- )
        6 0 do  dup flag  60 right  loop ;

: spinflag   ( -- )
        10 6flag  40 6flag ;

: petal1   ( size -- )
        dup  90 arcr  90 right
             90 arcr  90 right ;

: flower1     ( size -- )
        8 0 do   dup  petal1 45 right   loop   drop ;

: petal2   ( size -- )
        dup  60 arcr  120 right
             60 arcr  120 right ;

: flower2     ( size -- )
        6 0 do   dup  petal2 60 right   loop   drop ;

: ray   ( size -- )
        dup  90 arcl  dup 90 arcr
        dup  90 arcl       90 arcr ;

: sun     ( size -- )
        9 0 do   dup ray  160 right   loop  drop ;

: regular     ( size vertices -- )
        360 over /  swap
        0 do  over forward  dup right  loop
        drop drop ;

: stars   ( vertices times -- )
        over over *
        0 do  60 forward  over over 360 * swap / right  loop
        drop drop ;

: poly   ( size angle -- )
        compass@ >r
        begin
           over forward dup right
        compass@  r@ = until
        drop drop  r> drop ;

: polydemo5    5 0 do  45  72 poly  72 right  loop ;
: polydemo4    4 0 do  70 135 poly  90 right  loop ;
: polydemo12  12 0 do  15 right  xpenup   40 forward  xpendown
                         20 135 poly  15 right  loop ;

: tree   ( angle length recursion -- )
        >r
        r@ if
           over left
           dup 2 * forward
           over over r@ 1 - recurse
           dup 2 * back
           over 2 * right
           dup forward
           over over r@ 1 - recurse
           back  left
        else  drop drop then
        r> drop ;

variable dragon-size  3 dragon-size !
: dragon   ( n -- )
        dup  0 = if  dragon-size @ forward
              else  dup  0 > if     dup 1 - recurse
                                    90 right
                                    1 over - recurse
                             else  -1 over - recurse
                                    90 left
                                    1 over + recurse
              then  then
        drop ;


: demo ( -- )     \ Quick and dirty test
    xhome  180 left
    xpendown
\ Pick your poison and uncomment one of the lines to test.
\ ========================================================
     30 flower1  45 flower1  60 flower1
\    90 flower2  70 flower2  50 flower2
\    30 sun
\    polydemo5
\    polydemo4
\    polydemo12
\    diamonds
\    40 flag  40 6flag  spinflag
\    40 3 regular 40 5 regular 40 7 regular
\    8 3 stars
\    9 4 stars
\    20 15 5 tree
\    10 dragon-size !     8 dragon
\     3 dragon-size !    12 dragon
;  ( all done)

\ Set up image and run the demo
  cr cr ." Starting demo --"
    color_image
    500 pic_width !
    500 pic_height !
    clear-screen
    magenta 10 10 s" Turtle Graphics" gbanner
    demo
  s" testdemo.ppm"  save_image
  cr cr ." Image file saved as: testdemo.ppm" cr

