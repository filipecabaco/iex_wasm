\ 4tH library - TOOLBELT EMITS / COUNTS - Copyright 2005, 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] emits [IF]
: emits swap 0 ?do dup emit loop drop ;     ( n c --)
: counts 0 2swap bounds ?do over i c@ = + loop abs nip ;
[THEN]                                      ( a1 n2 c -- n2)

