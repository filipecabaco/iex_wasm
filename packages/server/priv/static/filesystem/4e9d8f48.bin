\ -- KISS generator --
\ http://objectmix.com/fortran/385655-random_number-intrinsic-gfortran.html
\ https://www.thecodingforums.com/threads/64-bit-kiss-rngs.673657/ (64 bit)
\ Algorithm 2007 by George Marsaglia
\ 4tH version 2009, 2021 - Bill Cook, Hans Bezemer

[UNDEFINED] kiss [IF]
variable x
variable y
variable z
variable w

max-n constant MAX-KISS

: seed4! w ! z ! y ! x ! ;
: seed4@ x @ y @ z @ w @ ;

: m ( k n ** m ) over swap shift xor ;

/cell 4 [=] [IF]                       \ 32bit environment

: znew z @ dup 65535 and 18000 * swap -16 shift + dup z ! ;
: wnew w @ dup 65535 and 30903 * swap -16 shift + dup w ! ;
: cong x @ 69069 * 1327217885 + dup x ! ;
: xsh y @ 13 m -17 m 5 m dup y ! ;
: mwc znew 16 shift wnew + ;

[ELSE]                                 \ 64bit environment

[UNDEFINED] u> [IF] include lib/ansdbl.4th [THEN]
[IGNORE] znew
[IGNORE] wnew

: cong x @ 6906969069 * 1234567 + dup x ! ;
: xsh y @ 13 m -17 m 43 m dup y ! ;
: mwc z @ 58 lshift w @ + z @ 6 rshift w ! dup z +! z @ u> w +! z @ ;
[THEN]

: kiss mwc cong + xsh + ;
: kiss-randomize time x ! cong y ! xsh z ! cong w ! ;

[UNDEFINED] random [IF]
  aka kiss random
  aka kiss-randomize randomize
  MAX-KISS constant MAX-RAND
[THEN]

[DEFINED] 4th# [IF]
  hide m
  hide znew
  hide wnew
[THEN]
[THEN]

\ 1066149217761810 362436362436362436 1234567890987654321 123456123456123456
\ seed4! 0 100000000 0 do drop kiss loop 
\ 1666297717051644203 = if ." OK" else ." Fail" then cr

