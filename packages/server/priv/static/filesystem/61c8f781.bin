\ 4tH library - UTF8 to GBK/2 conversion - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] utf8>gbk2   [IF]
[UNDEFINED] unicode|gbk [IF] [ABORT] [THEN]
[UNDEFINED] row [IF]
include lib/row.4th
[THEN]

[HEX]                                  ( n1 -- n2)
aka unicode|gbk unicode>gbk            \ converts a Unicode char to GBK/2
  does> 2 num-key row if cell+ @c else drop [char] ? then nip
;                                      \ reads a char from the string
                                       ( a1 a2 -- a1 a3 c)
: 8bit@ over over > if dup c@ swap char+ swap else 0 then dup 0= throw ;
                                       \ 1, 2, 3, 4 byte UTF-8 converters
: 8bits ;                              ( a1 a2 c -- a1 a3 n)
: 16bits 1F and 6 lshift >r 8bit@ 3F and r> + ;
: 24bits 0F and 0C lshift >r 8bit@ 3F and 6 lshift r> + >r 8bit@ 3F and r> + ;
: 32bits drop 3 0 do 8bit@ drop loop [char] ? ;
                                       \ switches 1, 2, 3 or 4 byte UTF-8
create unicode@
  80 , ' 8bits ,
  E0 , ' 16bits ,
  F0 , ' 24bits ,
  FF , ' 32bits ,                      \ converts a UTF-8 char to Unicode
does>                                  ( a1 a2 -- a1 a3 n)
  >r 8bit@ begin r@ @c over < while r> 2 cells + >r repeat r> cell+ @c execute
;
                                       \ converts a full Unicode char to GBK/2
: gbk!                                 ( a1 a2 n -- a1 a3)
  unicode>gbk dup 0>
  if dup FF and >r 8 rshift over c! char+ r> over c! char+ else drop then
;
                                       \ converts a UTF-8 char to GBK/2
: convert-utf8                         ( a1 a2 a3 a4 -- a1 a5 a3 a6)
  unicode@ swap >r swap >r dup 7F > if gbk! else over c! char+ then r> r>
;
                                       \ converts a UTF-8 string to GBK/2
: utf8>gbk2                            ( a1 n1 -- a1 n2)
  chars over + over swap over          \ org write eol read
  begin ['] convert-utf8 catch until drop drop over -
;

[DECIMAL]
[DEFINED] 4TH# [IF]
  hide convert-utf8
  hide gbk!
  hide unicode@
  hide 8bits
  hide 16bits
  hide 24bits
  hide 32bits
  hide 8bit@
  hide unicode>gbk
[THEN]
[THEN]

\ include lib/dump.4th [hex] hex 20 string tester
\ : encode swap 2dup 2>r bounds ?do i c! loop 2r> ;
\ a8 c2 a0 bb e9 49 bf bb ef 48 A tester encode utf8>gbk2 dup . dump cr
