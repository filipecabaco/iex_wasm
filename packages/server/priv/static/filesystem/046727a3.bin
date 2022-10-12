\ 4tH library - -LEADING - Copyright 2006,2007 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] -LEADING [IF]
: -leading                             ( a1 n1 -- a2 n2)
  begin
    dup
  while                                \ quit if length is zero
    over c@ bl =
  while                                \ quit if it is not a space
    chop
  repeat
;
[THEN]
