\ Turtle Graphics on the Fignition
\ Copyright Ashley Nathan Feniello, 2012

\ Based on a blog post here:
\ https://blogs.msdn.com/b/ashleyf/archive/2012/02/18/turtle-graphics-on-the-fignition.aspx

\ This implementation has only a few commands. This program is a quick hack to
\ get the example programs presented there working. I don't think I got the
\ coordinate system completely right, but the graphics are identical.

\ Note that the last two words are not implemented.

\ c – clear screen (cls doesn’t work in 160x160 graphics mode) 
\ g – Go to an x y coordinate (0,0 is the center of the screen) 
\ h – Set heading (0-60 - 0 is North, 15 East, 30 South, 45 West) 
\ b – Begin (enters 160x160 graphics mode, clears, resets turtle) 
\ t – Turn the turtle (see h above – negative values for counter-clockwise)
\ m – Move turtle number of pixels along current heading (no drawing)
\ p – Plot pixel currently under turtle
\ f – Forward number of pixels while plotting
\ e – End (waits for key, exits graphics mode) 
\ n – Sine function (used internally – see h above – returns scaled by 255) 

\ coordinate 0,0 in gTurtle is top-left - Fignition in the center
\ going North means moving down, so that requires a correction as well

include lib/graphics.4th
include lib/gturtle.4th

aka forward m                          \ these commands are identical
aka clear-screen c
                                       \ this is the gTurtle interface
: f xpendown forward xpenup ;          \ lift pen after use
: t 6 * right ;                        \ convert to gTurtle
: g 81 + swap 81 + turtle! ;           \ we're starting south (gTurtle)
: b 160 dup pic_width ! pic_height ! c 0 dup g 180 compass! ;
: h 6 * 180 - dup 0< if 360 + then compass! ;
: p turtle@ xpendown set_pixel xpenup ;
                                       \ heading and plotting words
[hex]
offset cosTable                        \ 4tH translation of Fignition cosine
  FF c, FE c, F9 c, F2 c, E9 c, DD c, CE c, BD c,
  AA c, 95 c, 7F c, 67 c, 4E c, 34 c, 1A c, 00 c,
[decimal]                              \ note we already got our own!

: tcos                                 ( ang -- cos[ang*6])
  abs 60 mod dup 29 > if               \ scaled by 255 (16 bit friendly)
    60 swap -                          \ note it's a quite simple
  then                                 \ table lookup with all values
  dup 14 > if                          \ embedded in the table
    -1 30 rot -                        \ no interpolation here
  else                                 \ just mapping to the proper
    1 swap                             \ quadrant - input is in degrees
  then
  cosTable 1+ *                        \ adjusted for "offset" use
;
                                       \ now for the Fignition examples
: sine 159 0 do i 80 - i 15 - tcos 4 / g p loop ;
: burst 60 0 do 0 dup g i h 110 f loop ;
: squiral -40 50 g 20 0 do 100 f 21 t loop ;
: circle 60 0 do 4 f 1 t loop ;
: spiral 15 0 do circle 4 t loop ;
: star 5 0 do 80 f 24 t loop ;
: stars 3 0 do star 20 t loop ;
: rose 0 50 0 do 2 + dup f 14 t loop drop ;
: hp 15 0 do 5 f 1 t loop 15 0 do 2 f -1 t loop ;
: petal hp 30 t hp 30 t ;
: flower 15 0 do petal 4 t loop ;
                                       \ generate and save the examples
b sine    s" sine.ppm"    save_image
b burst   s" burst.ppm"   save_image
b squiral s" squiral.ppm" save_image
b spiral  s" spiral.ppm"  save_image
b stars   s" stars.ppm"   save_image
b rose    s" rose.ppm"    save_image
b flower  s" flower.ppm"  save_image
