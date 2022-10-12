\ 4tH library - FILTER - Copyright 2004 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] filter [IF]
: filter                               ( a n1 c -- a n2)
  >r >r dup dup dup dup r> chars + >r  \ setup parameters
  begin                               
    begin                              \ search non-filter character
      dup r@ <> dup                    \ end of line?
      if over c@ r'@ = over and else dup then
    while                              \ is it the filter character?
      drop char+                       \ if not, next character
    repeat                             \ and drop the flag
  while                                \ store the character
     swap >r dup c@ r@ c! char+ r> char+ swap
  repeat                               \ calculate length new string
  r> r> drop drop drop swap chars -
;
[THEN]

