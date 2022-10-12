\ 4tH library - F** FALOG - Copyright 2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] f** [IF]
[UNDEFINED] fln  [IF] include lib/flnflog.4th [THEN]
[UNDEFINED] fexp [IF] include lib/fexp.4th    [THEN]
: f** fdup f0= if fdrop fdrop 1 s>f exit then fswap fln f* fexp ;
: falog 10 s>f fswap f** ;
[THEN]
