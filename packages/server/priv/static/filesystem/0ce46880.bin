\ R.Hempel 22Mar2002 Clean up comments for release
\ This work is based on Chris Jakeman's MAF and PAF Forth systems. Their
\ goal was to build a minimal ANS Forth that could be built by a standard
\ Forth system and made no assumptions about the underlying achitecture.
\ J.Bezemer 26Apr2007 4tH version
\ J.Bezemer 19Jun2009 Added S>DOUBLE, removed 0.
\ J.Bezemer 13Sep2010 Added >DOUBLE, renamed >DNUMBER
\ J.Bezemer 10Oct2011 Replaced 0 with U>D
\ J.Bezemer 23Feb2020 Replaced ABORT" with THROW"

[UNDEFINED] >dnumber [IF]
[UNDEFINED] digit?   [IF] [needs lib/digit.4th] [THEN]
[UNDEFINED] mu*      [IF] [needs lib/mixed.4th] [THEN]
[UNDEFINED] E.LIBERR [IF] [needs lib/throw.4th] [THEN]

\ ud1 is the unsigned result of converting the string into digits using
\ the current base and adding each into ud1 after multiplying ud1 by the base.
 
: >dnumber                             ( ud1 a1 u1 -- ud2 a2 u2)
  >r                                   ( u1 u2 a1 )
  begin                                ( u1 u2 a1 )
    dup r@                             ( u1 u2 a1 a1 u3)
  while                                ( u1 u2 a1 a1)
    c@ digit?                          ( u1 u2 a1 u3 f)
  while                                ( u1 u2 a1 u3)
    swap >r >r                         ( u1 u2)
    base @ mu* r> u>d d+ r> char+      ( u1 u2 a1)
    r> 1- >r                           ( u1 u2 a1)
  repeat                               ( u1 u2 a1)
  drop r>
;

: >double                              ( a n -- d f+ | f-)
  over c@ [char] - = dup >r if chop then 2>r 0. 2r> >dnumber
  r> swap >r nip if dnegate then r@ if 2drop then r> 0=
;
                                       ( a n -- d)
: s>double >double 0= E.LIBERR throw" Bad double" ;
[UNDEFINED] >number [IF]               \ create the alias >NUMBER
  aka >dnumber >number                 \ if it hasn't been defined already
[THEN]
[THEN]
