\ 4tH library - PARSE XML - Copyright 2011,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] skip-tag [IF]
[UNDEFINED] COMPARE  [IF] [NEEDS lib/compare.4th] [THEN]
[UNDEFINED] 2OVER    [IF] [NEEDS lib/anscore.4th] [THEN]
[UNDEFINED] '>'      [IF] [NEEDS lib/chars.4th]   [THEN]
                                       \ this doesn't do an automatic REFILL
: parse-tag                            ( -- a n)
  bl omit >in @ >r '>' parse dup
  if over c@ '<' =                     \ only adjust >IN if not end of buffer
    if 1+ else 2drop r@ >in ! '<' parse 2dup chars + c@ if -1 >in +! then then
  then r> drop
;                                      \ parse a tag, get next line if needed
                                       ( -- a n)
: next-tag begin parse-tag dup ?exit refill while 2drop repeat ;
                                       \ check for a tag
: check-tag                            ( a n --)
  next-tag 2dup 2>r compare
  if cout stdout use 2r> type ."  not expected here" cr use else rdrop rdrop then
;
                                       \ find a tag
: find-tag                             ( a1 n1 -- a1 n1 a2 n2)
  begin next-tag dup while 2over 2over compare while 2drop repeat
;
                                       \ check whether a tag is there
: expect-tag next-tag compare 0= ;     ( a n -- f)
: search-tag find-tag 2drop 2drop ;    ( a n --)
: skip-tag next-tag 2drop ;            ( --)
[THEN]                                 \ skip a tag
