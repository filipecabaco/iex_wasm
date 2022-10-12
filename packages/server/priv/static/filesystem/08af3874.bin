\ 4tH - ECHO - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Unix `echo`: 21 lines in Zimbra, 2 lines in 4tH
\ http://www.zimbu.org/Home/unix-echo-example

argn 1 > if 1 args 2 = swap dup c@ [char] - = swap char+ c@ [char] n = and and
1+ argn over ?do dup i <> if space then i args type loop 2 - if cr then then
