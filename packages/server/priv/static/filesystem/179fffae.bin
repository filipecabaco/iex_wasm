\ 4tH library - EXCEPTION - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Derived from SourceForge (http://forth.sourceforge.net/):
\ R.9 Exception reserved extension words

[UNDEFINED] exception [IF]             ( c-addr u -- n )
variable exception 0 latest ! does> 1 over +! @ nip nip ;
[THEN]

\ s" My 1st exception" exception .
\ s" My 2nd exception" exception . depth .
