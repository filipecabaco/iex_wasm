\ 4tH library - SWAPPING - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] swapping [IF]
: swapping                             ( a n c1 c2 -- a n)
  rot >r rot r@ over >r bounds         \ set up loop parameters
  ?do over i c@ = if dup i c! then loop drop drop r> r>
;                                      \ replace character if required
[THEN]

\ s| This is an "embedded" quote| char " char ' swapping type cr depth .