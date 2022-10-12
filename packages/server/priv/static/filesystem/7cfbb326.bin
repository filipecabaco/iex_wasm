\ 4tH library - Prefixed number formatter - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Print number n2 in a field n3 wide, with prefix a1 n1,
\ giving string a2 n4 in the numeric output buffer

[UNDEFINED] prefix# [IF]
: prefix#                              ( a1 n1 n2 n3 -- a2 n4)
  <# 0 ?do # loop >r dup chars rot + swap 
  0 ?do char- dup c@ hold loop drop r> #>
;                                      \ print the number - then the prefix
[THEN]

