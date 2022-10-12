\ 4tH library - Bit reverser - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] rev8bit [IF]
: rev8bit
   dup 240 and 4 rshift >r 15 and 4 lshift r> or
   dup 204 and 2 rshift >r 51 and 2 lshift r> or
   dup 170 and 1 rshift >r 85 and 1 lshift r> or
;
                                       \ reverse n2 bytes
: (reverse)                            ( n1 n2 -- n3)
  >r 0 tuck begin                      \ setup counter
    dup r@ <                           \ limit reached?
  while                                \ if not, process another byte
    1+ >r dup 255 and rev8bit rot 8 lshift or swap 8 rshift r>
  repeat drop drop r> drop             \ clean up the stack
;

: revcell /cell (reverse) ;            ( n1 -- n2)
: rev16bit 2 (reverse) ;               ( n1 -- n2)
: rev32bit 4 (reverse) ;               ( n1 -- n2)

[DEFINED] 4TH# [IF] hide (reverse) [THEN]
[THEN]

\ [binary] 10 base ! 11110001101 rev16bit .
