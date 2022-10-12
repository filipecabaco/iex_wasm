\ 4tH library - ISDATE - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The following constant is encoded like this (2 bits/month):

\  3 2 3 2 3 3 2 3 2 3 0 3
\ 111011101111101110110011

[UNDEFINED] isdate [IF]                ( month -- #days)
: days/month 15662003 swap 1- 2* rshift 3 and 28 or ;
: leapyear? dup 4 mod 0= over 100 mod 0<> and swap 400 mod 0= or ;
: days/mm-yyyy leapyear? over 2 = and >r days/month r> if 1+ then ;
: isdate >r over over r@ days/mm-yyyy 1+ < >r over 0> r> and r> swap ;
[THEN]                                 ( d m y -- d m y flag)

