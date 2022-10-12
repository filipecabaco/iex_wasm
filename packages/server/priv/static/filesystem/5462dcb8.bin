\ 4tH - Right leaning fractal tree - Copyright 2014, 2021 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[DEFINED] ANS [IF]
  include lib/fp3.4th                  \ for floating point
  include lib/fsinfcos.4th             \ for FSIN, FCOS
  include lib/fpconst.4th              \ for PI (requires at least FP2)
[ELSE]
  include lib/fp2.4th                  \ for floating point
  include lib/zenfsin.4th              \ for FSIN, FCOS
  include lib/zenconst.4th             \ for PI (requires at least FP2)
[THEN]

include lib/fstack.4th                 \ for FSTACK
include lib/graphics.4th               \ graphics package

12 constant #level                     \ depth of recursion

#level floats cell+ array xs           \ stack for X-coordinates
#level floats cell+ array ys           \ stack for Y-coordinates

float array len                        \ size of branch
float array x                          \ x-coordinate
float array y                          \ y-coordinate
float array rotation                   \ rotation required
                                       \ several FP constants
float array A1 pi 27 s>f f/ latest f! does> f@ ;
float array A2 pi  8 s>f f/ latest f! does> f@ ;
float array C1 70 s>f 100 s>f f/ latest f! does> f@ ;
float array C2 85 s>f 100 s>f f/ latest f! does> f@ ;
                                       \ draw a branch
: drawline                             ( --)
  y f@ fdup f>s >r x f@ fdup f>s >r fswap
  rotation f@ fsin fnegate len f@ f* f+ fswap
  rotation f@ fcos len f@ f* f+        \ calculate new coordinates
  fover f>s >r fdup f>s r> r> r> line  \ convert to integers and draw line
  x f! y f!                            \ set new coordinates
;
                                       ( f1 f2 --)
: update len f@ f* len f! rotation f@ f+ rotation f! ;
                                       \ draw the tree
: tree                                 ( --)
  x f@ xs >fs y f@ ys >fs drawline     \ draw a branch
  xs fsdepth #level <                  \ if level not reached
  if                                   \ draw the next set of branches
    A1 fnegate C1 update recurse       \ by doing recursion
    A1 A2 f+ 1 s>f C1 f/ C2 f* update recurse
    A2 fnegate 1 s>f C2 f/ update
  then
  xs fs> x f! ys fs> y f!              \ retrieve coordinates
;

 63 s>f len f!                         \ initialize values
300 s>f x f!
 70 s>f y f!
 pi rotation f!

xs fstack ys fstack                    \ initialize stacks

300 pic_width !                        \ set screen size
300 pic_height !

grayscale_image                        \ make black&white image
255 whiteout                           \ make white background
black                                  \ use black ink

tree s" fractre2.ppm" save_image       \ generate and save image
