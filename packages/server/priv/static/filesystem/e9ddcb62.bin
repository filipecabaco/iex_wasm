\ Virtual memory library - Copyright 2012,2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] vallot [IF]
[UNDEFINED] block  [IF] include lib/multiblk.4th [THEN]
variable vallot 0 latest !
  does> over b/buf min over @ dup rot + b/buf / b/buf * max rot over + rot ! ;

: paging @ b/buf /mod block + ;
: +paging swap @ + b/buf /mod block + ;
aka update &
[THEN]