\ DDA lines - Copyright 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] ray [IF]
[UNDEFINED] dda [IF] include lib/dda.4th [THEN]

variable (count)                       \ variable intended for counting
variable (start)                       \ variable intended for start condition
                                       \ several support functions
: orange ( -- )    pic_intensity @  dup 165 * 255 / 0  color! ;
: purple ( -- )    pic_intensity @ 2/ 0 over color! ;
: (rgb) 0 c/pixel over do 256 * + loop ;
: (?pixel) if 2drop else set_pixel then ;
                                       ( x y f --)
256 256 256 * * constant (f_blank)     \ flag: don't paint this pixel
(f_blank) 2*    constant (f_other)     \ flag: last pixel had another color
(f_blank) 1-    constant (rgb_mask)    \ filter out original RGB colot
                                       \ callback function for DDA
: (behind)                             ( x y --)
  over over pixel@ (rgb) (start) @ dup >r (rgb_mask) and =
  if                                   \ is this the original color?
    r@ (f_blank) and (?pixel) r> (f_other) invert and
  else                                 \ paint only on false flag
    2drop r> dup (f_other) and unless (f_blank) xor then (f_other) or
  then (start) !                       \ toggle paint flag on transition
;
                                       \ interrupt drawing when crossed
: behind                               ( x1 y1 x2 y2 --)
  >r >r over over pixel@ (rgb) (start) ! r> r> ['] (behind) dda
;                                      \ callback function for DDA
                                       ( x1 y1 x2 y2 --)
: (ray) (count) @ (start) @ < (?pixel) 1 (count) +! ;
                                       \ paint the last n% of the line
: ray                                  ( x1 y1 x2 y2 percent --)
  100 swap - >r hypotenuse r> * 100 / (start) !
  0 (count) ! ['] (ray) dda
;
                                       \ callback function for DDA
: (dotted)                             ( x y --)
  (count) @ (start) @ / 1 and (?pixel) 1 (count) +!
;
                                       \ draw of dotted line of n pixels long
: dotted                               ( x1 y1 x2 y2 n --)
  (start) ! 0 (count) ! ['] (dotted) dda
;
                                       \ callback function for DDA
create (rainbow)                       ( x y --)
  ' red , ' orange , ' yellow , ' green , ' cyan , ' blue , ' purple ,
does> (count) @ (start) @ 1 max / 6 min cells + @c execute set_pixel 1 (count) +! ;
                                       \ draw a rainbox colored line
: rainbow                              ( x1 y1 x2 y2 --)
  color@ >r >r >r hypotenuse 7 / (start) ! 0 (count) !
  ['] (rainbow) dda r> r> r> color!
;                                      \ save and restore current color

[DEFINED] 4TH# [IF]
  hide (count)
  hide (start)
  hide (rgb)
  hide (?pixel)
  hide (f_blank)
  hide (f_other)
  hide (rgb_mask)
  hide (behind)
  hide (ray)
  hide (dotted)
  hide (rainbow)
[THEN]
[THEN]


