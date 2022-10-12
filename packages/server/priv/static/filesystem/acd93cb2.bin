\ Floodfill library - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] gfill     [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]

ppm_width ppm_height * constant /gfill \ size graphics stack
/gfill array (gfill)                   \ allocate graphics stack
                                       \ is this valid point on bitmap?
: xy?                                  ( x y -- x y f)
  over 0< over 0< or 0= >r over pic_height @ < over pic_width @ < and r> and
;                                      \ condense rgb in one single number
                                       ( n1|r g b -- n2)
: (rgb) 0 c/pixel over do 256 * + loop ;
: gfill> (gfill) a> 65536 /mod ;
                                       ( -- x y)
: >gfill                               ( x y color --)
  >r xy?                               \ valid point on the bitmap?
  if over over pixel@ (rgb) r> = if 65536 * + (gfill) >a ;then else rdrop then
  drop drop                            \ if so, does it have the proper color?
;                                      \ if not, don't put it on the stack
                                       \ main floodfill routine
: gfill                                ( x y --)
  xy? if                               \ is it a valid number on the bitmap?
    (gfill) stack over over pixel@ (rgb) dup >r >gfill
    begin                              \ if so, start up and get its color
      (gfill) adepth                   \ any points left on the stack?
    while                              \ if so, get the next point
      gfill> over over set_pixel       \ set it to the current color
      over 1+ over r@ >gfill           \ and put its neighbors on the stack
      over 1- over r@ >gfill
      over over 1+ r@ >gfill 1- r@ >gfill
    repeat rdrop                       \ drop the original color
  else
    drop drop                          \ not a valid point, drop it
  then
;

[DEFINED] 4TH# [IF]
  hide xy?
  hide >gfill
  hide gfill>
  hide (gfill)
  hide (rgb)
  hide /gfill
[THEN]
[THEN]

\ include lib/gcircle.4th 800 pic_width ! 600 pic_height ! color_image 255
\ whiteout black 300 400 250 circle red 300 400 gfill s" test.ppm" save_image
