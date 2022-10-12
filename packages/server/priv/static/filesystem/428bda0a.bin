\ Mutual recursion - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Two functions are said to be mutually recursive if the first calls the
\ second, and in turn the second calls the first. 

defer m

: f dup if dup 1- recurse m - else 1+ then ;
:noname dup if dup 1- recurse f - then ; is m
: main 20 0 do i f . loop cr 20 0 do i m . loop cr ;

main

\ See: http://en.wikipedia.org/wiki/Hofstadter_sequence#Hofstadter_Female_and_Male_sequences

\ F: 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 11, 11, 12, 13, ...
\ (sequence A005378 in OEIS)
\ M: 0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12, 12, ...
\ (sequence A005379 in OEIS) 
