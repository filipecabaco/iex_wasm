\ 4tH library - CORE EXT HOLDS - Copyright 2011, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] holds [IF]                 ( a n --)
: holds begin dup while 1- 2dup chars + c@ hold repeat 2drop ;
: sign+ swap 0< if [char] - else [char] + then hold ;
[THEN]                                 ( n1 n2 -- n2)
