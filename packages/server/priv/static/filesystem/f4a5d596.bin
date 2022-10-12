\ 4tH library - REVERSE - Copyright 2010 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] reverse [IF]
: reverse
  2dup 1- chars over +                 \ save string, calculate addresses
  begin
    over over <                        \ as long we didn't pass the middle
  while                                \ swap the characters
    over c@ over c@ >r over c! over r> swap c!
    1- swap 1+ swap                    \ increment pointers
  repeat 2drop                         \ drop the addresses
;
[THEN]