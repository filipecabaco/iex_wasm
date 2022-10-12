\ floodfill 3/16/00 10:29 am NAB
\ A non-recursive flood fill algorithm. 
\ Fills any bounded area with the current drawing color.
\ Assumed to be in the public domain c.l.f

[UNDEFINED] flood     [IF]
[UNDEFINED] set_pixel [IF] [ABORT] [THEN]
[UNDEFINED] 2over     [IF] include lib/anscore.4th [THEN]

variable fill-color

[DEFINED] usestackflood [IF]
variable (#point)

: (pack) 65536 * + 1 (#point) +! ;
: (unpack) 65536 /mod ;
[ELSE]
ppm_height constant /flood
/flood array (flood)                   \ allocate graphics stack

: flood> (flood) a> 65536 /mod ;
: >flood 65536 * + (flood) >a ;
[THEN]
                                       \ is this valid point on bitmap?
: xy?                                  ( x y -- x y f)
  over 0< over 0< or 0= >r over pic_height @ < over pic_width @ < and r> and
;                                      \ condense rgb in one single number
                                       ( n1|r g b -- n2)
: (rgb) 0 c/pixel over do 256 * + loop ;

: clear?                               ( y x -- flag )
  xy? if pixel@ (rgb) fill-color @ = else 2drop false then ;  

: border?                              ( y x -- flag )
  clear? 0= ;

: fill-line                            ( y x -- left right )
  2dup                                 ( y x y x)
  begin  1+  2dup border? until        ( y x y end)
  1- >r drop  1+                       ( y x-1 )
  begin  1-  2dup border? until
  1+                                   ( y begin)
  over  r>                             ( y begin y end )
  2over 2over 1+ line
  nip rot drop ;

: testpair                             ( y x -- flag )
  2dup clear? >r  1+ border?  r> and ;

[DEFINED] usestackflood [IF]
: scanline                             ( y left right -- y | y x1 [... y xn] y )
  1+ swap ( right+1 left ) ?do
    i 2dup testpair if
      stow (pack) swap
    else  drop  then
  loop ;

: scanlast                             ( y y right -- y | y right y )
  2dup clear? if (pack) swap
  else  2drop  then ;

: pour ( y x -- )
  0 (#point) ! (pack)
  begin
    (unpack) 2dup clear? if
      stow fill-line swap >r >r
      1- r'@ r@  scanline  dup r@ scanlast
      2 +  r'@ r@ scanline  dup r> scanlast r>
    then 2drop (#point) -1 over +! @ 0= 
  until ;
[ELSE]
: scanline                             ( y left right -- y | y x1 [... y xn] y )
  1+ swap ( right+1 left ) ?do
    i 2dup testpair if
      stow >flood
    else drop then
  loop ;

: scanlast                             ( y y right -- y | y right y )
  2dup clear? if >flood
  else  2drop  then ;

: pour ( y x -- )
  (flood) stack >flood
  begin
    flood>
    2dup clear? if
      stow fill-line swap >r >r
      1- r'@ r@ scanline dup r@ scanlast
      2 +  r'@ r@ scanline dup r> scanlast r>
    then 2drop (flood) adepth 0= 
  until ;
[THEN]

: flood                                ( y x -- )
  2dup pixel@ (rgb) dup fill-color !
  color@ (rgb) = if 2drop else pour then ;

[DEFINED] 4TH# [IF]
  hide xy?
  hide (rgb)
  hide pour
  hide scanlast
  hide scanline
  hide fill-line
  hide fill-color
  hide testpair
  hide border?
  hide clear?
[THEN]
[THEN]


