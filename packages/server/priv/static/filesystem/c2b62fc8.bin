\ 4tH 4 bits adder - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ The aim of this program is to "simulate" a four-bit adder "chip".
\ This "chip" can be realized using four 1-bit full adders. Each of
\ these 1-bit full adders can be with two half adders and an or gate.
\ Finally a half adder can be made using a xor gate and an and gate.
\ The xor gate can be made using two nots, two ands and one or.

\ Not, or and and, the only allowed "gates", can be "imitated" by using
\ the bitwise operators.

include lib/pickroll.4th

: "NOT" invert 1 and ;
: "XOR" over over "NOT" and >r swap "NOT" and r> or ;
: halfadder over over and >r "XOR" r> ;
: fulladder halfadder >r swap halfadder r> or ;

: 4bitadder                            ( a3 a2 a1 a0 b3 b2 b1 b0 -- r3 r2 r1 r0 c)
  4 roll 0  fulladder swap >r >r
  3 roll r> fulladder swap >r >r
    rot  r> fulladder swap >r fulladder r> r> r> 3 roll
;

: .add4 4bitadder 0 .r 3 roll 0 .r rot 0 .r swap 0 .r 0 .r cr ;

1 1 0 0     0 0 1 1  .add4
