\ Jensen's Device - Copyright 2010 J.L Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Jensen's Device is a computer programming technique devised by Danish
\ computer scientist Jørn Jensen after studying the ALGOL 60 Report.
\ The following program was proposed to illustrate the technique. It
\ computes the 100th harmonic number: 5.18737751763962024

include lib/ansfloat.4th
include lib/ansfpio.4th

fclear 20 set-precision

: sum 0 s>f 1+ swap ?do i over execute f+ loop drop ;
:noname s>f 1 s>f fswap f/ ; 1 100 sum f.