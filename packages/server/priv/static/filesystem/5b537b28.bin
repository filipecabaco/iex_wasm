\ 4tH library - F> F>= F<> F<= - Copyright 2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ In order to preserve memory, it will abort rather than to
\ include the entire floating point emulation library again.

[UNDEFINED] f> [IF]
[UNDEFINED] f< [IF] [ABORT] [THEN]
: f> fswap f< ;
: f>= f< 0= ;
: f<> f= 0= ;
: f<= f> 0= ;
[THEN]
