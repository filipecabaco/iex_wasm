\ 4tH library - PLACE-LINE - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ This word copies a line from a buffer to a string, leaving add/count
\ of the copied string and the remainder of the buffer. Note CR and LF
\ are treated exactly the same. Parsing stops when the remaining buffer
\ has zero length. The resulting string is NOT terminated.

[UNDEFINED] place-line [IF]
10 constant \n                         \ LF character
13 constant \r                         \ CR character

: place-line                           ( a1 n1 a2 n2 -- a1+x n2-x a2 x)
  2>r tuck 2r> rot min 2dup 0          \ setup loop parameters
  ?do                                  \ exit if  a \r or \n was found
     drop drop over i chars + c@ dup \r = over \n = or
     if drop i dup 1+ leave else over i chars + c! i 1+ dup then
  loop -rot 2>r rot swap /string 2r>   \ clean up residual buffer
;
[then]

\ include lib/escape.4th
\ s" This is the end.\r\n\My only friend, the end.\r\n" s>escape
\ begin 0 >in ! source place-line >string 0 parse type cr dup 0= until 2drop