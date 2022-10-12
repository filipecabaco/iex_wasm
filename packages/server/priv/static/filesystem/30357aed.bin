\ 4tH Fractal tree - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[DEFINED] ANSFP [IF]
  include lib/fp3.4th                  \ use ANS float
  include lib/fsinfcos.4th             \ for FSIN, FCOS
  include lib/fdeg2rad.4th             \ for DEG>RAD
[ELSE]
  include lib/fp1.4th                  \ use Zen float
  include lib/zenfsin.4th              \ for FSIN, FCOS
  include lib/zendegrd.4th             \ for DEG>RAD
[THEN]

include lib/flocals.4th                \ for FLOCALS
include lib/graphics.4th               \ graphics package

 25 constant spread                    \ spread of branches
160 constant sizX                      \ half width
120 constant sizY                      \ half height
 10 constant depth#                    \ number of sub branches

fclear 76 s>f 100 s>f f/               \ define an FP constant
float array scale latest f! does> f@ ; \ ugly, but it works

: branch                               ( x y size angle depth --)
  >r >r 0 s>f fdup 5 flocals           ( save FP locals)
  f:a f@ f:c f@ r@ s>f deg>rad fcos f* f+ f:d f!
  f:b f@ f:c f@ r@ s>f deg>rad fsin f* f+ f:e f!
  f:a f@ f>s f:b f@ f>s f:d f@ f>s f:e f@ f>s line r>
  r@ 0> if                             \ depth reached?
    >r f:d f@ f:e f@ f:c f@ scale f* r@ spread -
    r> r> 1- dup >r swap >r branch     \ if not, draw new branches
    f:d f@ f:e f@ f:c f@ scale f* r> spread + r> branch
  else
    r> drop drop                       \ otherwise, drop values
  then
  end-flocals                          \ and release FP locals
;

sizX 2* pic_width !                    \ set screen size
sizY 2* pic_height !

grayscale_image                        \ make black&white image
255 whiteout                           \ make white background
black                                  \ use black ink
                                       \ draw the image
sizY 2* s>f sizX s>f sizY 2/ s>f 180 depth# branch
s" fractree.ppm" save_image            \ and save it
