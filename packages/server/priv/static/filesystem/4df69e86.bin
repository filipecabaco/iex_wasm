\ 4tH library - GBK/2 to UTF8 conversion - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] gbk2>utf8   [IF]
[UNDEFINED] unicode|gbk [IF] [ABORT] [THEN]
[UNDEFINED] row [IF]
include lib/row.4th
[THEN]

[HEX]                                  ( n1 -- n2)
aka unicode|gbk gbk>unicode            \ converts a GBK/2 char to Unicode
    does> cell+ 2 num-key row if cell- @c else drop FFFD then nip ;
                                       \ reads a char from the string
: 8bit@ over over > if dup c@ swap char+ swap else 0 then dup 0= throw ;
: 8bit! >r over over > if r> over c! char+ else r> 0<> throw then ;
: 16bit! dup >r 6 rshift C0 or 8bit! r> 3F and 80 or 8bit! ;
                                       ( a1 a2 -- a1 a3 c)
: 24bit!                               ( n --)
  dup >r 0C rshift E0 or 8bit!         \ first byte
  r@ 6 rshift 3F and 80 or 8bit!       \ second byte
  r> 3F and 80 or 8bit!                \ third byte
;

: 32bit! drop FFFD 24bit! ;            ( n --)

create utf!
     7F , ' 8bit! ,
    7FF , ' 16bit! ,
   FFFF , ' 24bit! ,
  max-n , ' 32bit! ,
   NULL ,                              ( n -- )
does> begin over over @c > while 2 cells + repeat cell+ @c execute ;
                                       ( a1 n1 a2 n2 -- a1 n3 a2 n4 n5)
: gbk@ 8bit@ dup 7F > if 8 lshift >r 8bit@ r> or then ;
: convert-gbk2 gbk@ swap >r swap >r dup 7F > if gbk>unicode then utf! r> r> ;
                                       ( a1 n1 a2 n2 -- a1 n3 a2 n4)
: gbk2>utf8                            ( a1 n1 a2 n2 -- a2 n3)
  rot >r rot >r chars over + over r> r> chars over + swap
  begin ['] convert-gbk2 catch until drop drop nip over -
;                                      \ org eol write eol read

[DECIMAL]
[DEFINED] 4TH# [IF]
  hide convert-gbk2
  hide gbk@
  hide utf!
  hide 8bit!
  hide 16bit!
  hide 24bit!
  hide 32bit!
  hide 8bit@
  hide gbk>unicode
[THEN]
[THEN]

\ include lib/dump.4th [hex] hex 20 string gbk-s 40 string utf-s
\ : encode swap 2dup 2>r bounds ?do i c! loop 2r> ;
\ BB A1 C0 A1 49 ED EE 48 8 gbk-s encode utf-s 40 gbk2>utf8 dup . dump cr
