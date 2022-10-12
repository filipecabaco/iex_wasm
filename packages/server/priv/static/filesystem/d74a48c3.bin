\ 4tH library - Semi-prime - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Semiprime numbers are natural numbers that are products of exactly two
\ (possibly equal) prime numbers. Example: 1679 = 23 × 73 (This particular
\ number was chosen as the length of the Arecibo message).

[UNDEFINED] semiprime? [IF]
: semiprime?
  0 swap dup 2 do
    begin dup i mod 0= while i / swap 1+ swap repeat
    over 1 > over i dup * < or if leave then
  loop 1 > abs + 2 =
;
[THEN]
