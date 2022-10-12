\ 4tH library - USER PAD - Copyright 2008,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] >pad [IF]
[UNDEFINED] /upad [IF]
4096 constant /upad
[THEN]

/upad string upad
upad /upad + constant upad|
upad value uhld
                                       ( n -- a)
: claim dup uhld + upad| > if upad else uhld then dup rot chars + to uhld ;
: >pad dup 1+ claim over >r dup >r place r> r> ;
                                       ( a1 n -- a2 n)
[DEFINED] 4TH# [IF]
  hide upad
  hide /upad
  hide upad|
  hide uhld
[THEN]
[THEN]
