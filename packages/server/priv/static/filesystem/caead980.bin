\ 4tH library - SLOC - Copyright 2006,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/row.4th
include lib/parsname.4th
include lib/argopen.4th

defer read                             \ primitive to read file
                                       ( -- f)
: closing? [char] ) dup parse chars + c@ <> ;
: xt? 2 string-key row >r r@ if nip nip cell+ @c else drop then r> ;
: usage abort" Usage: sloc forthfile" ; 
: read-seq refill ;                    ( -- f)
: read-blk tib 64 accept 0> 0 >in ! ;  ( -- f)
: is-seq ['] read-seq is read ;        ( --)
: is-blk ['] read-blk is read ;        ( --)
: +word 2drop 1+ ;                     ( n1 n2 n3 -- n1+1)
: skip-char parse +word ;              ( n c -- n+1)
: skip-paren [char] ) skip-char ;      ( n -- n+1)
: skip-bar [char] | skip-char ;        ( n -- n+1)
: skip-quote [char] " skip-char ;      ( n -- n+1)
: skip-word parse-name +word ;         ( n -- n+1)
: source? 0> if 1+ then ;              ( n1 n2 -- n3)
: source-line source? 0 read ;         ( n1 n2 -- n3 0 f)
: comment-line source-line drop ;      ( n1 n2 -- n3 0)
: comment begin closing? while source-line 0= until ;
                                       ( n1 n2 -- n3 0)
create comments                        \ parsing the forth source
  ," #!"          ' comment-line ,
  ," ("           ' comment ,
  ," \"           ' comment-line ,
  ," @goto"       ' comment-line ,
  ," char"        ' skip-word ,
  ," [char]"      ' skip-word ,
  ," [defined]"   ' skip-word ,
  ," [undefined]" ' skip-word ,
  ," .("          ' skip-paren ,
  ," c|"          ' skip-bar ,
  ," s|"          ' skip-bar ,
  ," .|"          ' skip-bar ,
  ," ,|"          ' skip-bar ,
  ,| c"|          ' skip-quote ,
  ,| s"|          ' skip-quote ,
  ,| ."|          ' skip-quote ,
  ,| ,"|          ' skip-quote ,
  ,| abort"|      ' skip-quote ,
  ,| throw"|      ' skip-quote ,
  NULL ,
does> xt? if execute else +word then ;

create mode                            \ how to read the file
  ," 4th"         ' is-seq ,
  ," seq"         ' is-seq ,
  ," .fs"         ' is-seq ,
  ," frt"         ' is-seq ,
  ," fth"         ' is-seq ,
  ," scr"         ' is-blk ,
  ," blk"         ' is-blk ,
  NULL ,
does> xt? if execute else usage then ;

: Process begin parse-name dup 0<> while comments repeat 2drop ;
: count-lines 0 0 begin source-line while Process repeat source? ;
: filetype 1 args dup 3 - /string ;    ( -- a n)
: sloc argn 2 < usage input 1 arg-open filetype mode count-lines . cr close ;

sloc
