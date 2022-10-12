\ 4tH library - -QUOTES - Copyright 2004,2007 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ strip leading and trailing quotes from a string
\ leave an addr/count string result

[UNDEFINED] -quotes [IF]
: -quotes                              ( a1 n1 -- a2 n2)
  2dup over c@ >r 1- chars + c@ r> over = over [char] "  = rot [char] '  =
  or and if chop 1- then
;
[THEN]

