\ 4tH library - INIFILE - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] inifile [IF]
[UNDEFINED] NULL    [IF] include lib/constant.4th [THEN]
[UNDEFINED] compare [IF] include lib/compare.4th  [THEN]

\ Typical use:

\ variable num1
\ 16 string str1

\ : getnum1 number num1 ! ;            ( a n --)
\ : getstr1 str1 place ;               ( a n --)

\ create myini
\   ," config" ," number1" ' getnum1 ,
\   ," init"   ," string1" ' getstr1 ,
\   NULL ,

\ myini s" myini.ini" inifile

64 constant (/section)                 \ maximum length section
(/section) string (section)            \ section label
                                       \ get the section name
: (getsection) 1 >in +! [char] ] parse (/section) 1- min (section) place ;
: sectionless 0 dup (section) place ;  ( --)
                                       \ get the value
: (getvalue)                           ( a n x1 -- a n x2 f)
  dup @c count (section) count compare >r
  cell+ >r 2dup r@ @c count compare r> cell+ swap r> or 0= tuck
  if dup 0 parse rot @c execute then cell+ swap
;                                      \ if found, execute word
                                       \ search for section/key
: (findkey)                            ( x -- x)
  dup [char] = parse rot over          ( x a n x n)
  if begin dup @c NULL <> while (getvalue) until then drop 2drop
;
                                       \ evaluate the first character
: (firstchar)                          ( x c -- x)
  dup [char] [ = if                    \ sections begin with a [
    drop (getsection)                  \ drop character and get section
  else                                 \ ignore comments
    dup [char] # = swap [char] ; = or 0= if (findkey) then
  then                                 \ no section or comment? It is a key
;

: inifile                              ( x a n -- f)
  input open error? if drop drop true exit then tuck use
  begin                                \ cannot open file, abort
    refill                             \ get the next line
  while                                \ get the first character
    bl omit >in @ >r 0 parse r> >in !  \ and evaluate it, restore string
    0> if c@ (firstchar) else drop then
  repeat drop close false              \ drop table address and close file
;

[DEFINED] 4TH# [IF]
  hide (/section)
  hide (section)
  hide (getsection)
  hide (getvalue)
  hide (findkey)
  hide (firstchar)
[THEN]
[THEN]
