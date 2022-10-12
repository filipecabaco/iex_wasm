\ 4tH library - CAPITALIZE - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] capitalize [IF]
[UNDEFINED] char>upper [IF]
include lib/ulcase.4th
[THEN]

: capitalize                           ( a n -- a n)
  2dup true >r begin                   \ save string, signal capitalize
    dup 0>                             \ if there is still any string left
  while                                \ check if it is the first character
    over dup c@ dup is-lower r> and    \ of a word (we had whitespace before)
    if char>upper swap c! false >r else is-white >r drop then chop
  repeat r> drop 2drop                 \ if so, capitalize; if not check for
;                                      \ whitespace and save flag
[THEN]

