\ 4tH library - Easy PP4tH interface - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License
                                       \ compile a floating point number
: f%
  bl word count >float 0= abort" Bad float"
  state @ if postpone fliteral then
; immediate
                                       \ compile a double number
: d%
  0. bl word count over c@ dup [char] - = dup >r
  if 0<> else [char] + = then if 1 /string then
  >number abort" Bad double" drop r> if dnegate then
  state @ if postpone 2literal then
; immediate

