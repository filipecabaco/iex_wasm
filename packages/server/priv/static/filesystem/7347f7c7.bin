\ 4tH library - PRIME? - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] prime? [IF]
: prime?                               ( n -- f)
  0 swap dup 4 <
  if
    dup 1 > if swap then
  else
    dup 1 and
    if
      3 begin
        over over / over >=
      while
        over over mod
      while
        2 +
      repeat mod swap
    then 
  then drop 0<>
;
[THEN]
