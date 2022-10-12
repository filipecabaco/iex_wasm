\ 4tH library - S>EMBED - Copyright 2008,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Typical use: S" [#33=>$21]&41;" S>EMBED

[UNDEFINED] s>embed [IF]
[UNDEFINED] >number [IF] include lib/tonumber.4th [THEN]
[UNDEFINED] row     [IF] include lib/row.4th [THEN]

create \embed
  char % , 2 ,
  char & , 8 ,
  char # , 10 ,
  char $ , 16 ,
  null ,
does> 2 num-key row dup >r if nip cell+ @c else drop then r> ;

: s>embed                              ( a1 n1 -- a1 n2)
  over dup >r >r                       \ setup loop parameters
  begin                                \ begin loop
    dup                                \ limit reached?
  while                                \ if not
    over c@ >r chop r> \embed          \ if embedded, convert number
    if base @ >r base ! 0 -rot >number rot r> base ! then
    r@ c! r> char+ >r                  \ save and update parameters
  repeat                               \ next character
  drop drop r> r> tuck -               \ cleanup stacks
;
[DEFINED] 4TH# [IF]
hide \embed
[THEN]
[THEN]
