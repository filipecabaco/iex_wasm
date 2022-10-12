\ 4tH library - TOOLBELT SPLIT - Copyright 2003,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] /SPLIT [IF]
: (split) ( a1 n1 a2 n2 -- a2 n2 a1 n1-n2 n2) dup >r rot >r rot r> r@ - r> ;
: /split  ( a1 n1 a2 n2 -- a2 n2 a1 n1-n2)    (split) drop ;
: -split  ( a1 n1 a2 n2 -- a2 n2 a1+n2 n1-n2) (split) chars rot + swap ;
[DEFINED] 4TH# [IF]
  hide (split)
[THEN]
[THEN]