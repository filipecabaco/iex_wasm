\ 4tH program - SUBLEQ - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Subleq is an example of a One-Instruction Set Computer (OISC).
\ It is named after its only instruction, which is SUbtract and Branch if
\ Less than or EQual to zero. This example executes:

\ start:
\     zero, message, -1
\     message, -1, -1
\     neg1, start+1, -1
\     neg1, start+3, -1
\     zero, zero, start
\ zero: 0
\ neg1: -1
\ message: "Hello, world!\n\0"

\ Links:
\ 1. http://esolangs.org/wiki/Subleq
\ 2. http://en.wikipedia.org/wiki/One_instruction_set_computer
\ 3. http://techtinkering.com/2009/03/05/the-subleq-urisc-oisc-architecture/

include lib/enter.4th                  \ for ENTER

32 array M                             \ create VM memory
                                       \ some helper words
: init M 32 cells bounds ?do i ! 1 cells +loop ; : M[] cells M + ;
: b-a+! dup dup cell+ @ M[] swap @ M[] @ negate over +! ;
: c b-a+! @ 1- 0< if 2 cells + @ else swap 3 + then nip ;
: b? dup cell+ @ 0< if @ M[] @ emit 3 + else c then ;
: a? dup @ 0< if cell+ @ M[] enter swap ! 3 + else b? then ;
: subleq 0 begin dup 1+ 0> while dup M[] a? repeat drop ;

0 10 33 100 108 114 111 119 32 44 111 108 108 101 72
-1 0 0 15 15 -1 3 16 -1 1 16 -1 -1 17 -1 17 15
                                       \ code is toggled in in reverse
init subleq                            \ initialize and execute
