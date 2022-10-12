\ 4tH - 12 statements - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Given the following twelve statements, which of them are true?

\ 1.  This is a numbered list of twelve statements.
\ 2.  Exactly 3 of the last 6 statements are true.
\ 3.  Exactly 2 of the even-numbered statements are true.
\ 4.  If statement 5 is true, then statements 6 and 7 are both true.
\ 5.  The 3 preceding statements are all false.
\ 6.  Exactly 4 of the odd-numbered statements are true.
\ 7.  Either statement 2 or 3 is true, but not both.
\ 8.  If statement 7 is true, then 5 and 6 are both true.
\ 9.  Exactly 3 of the first 6 statements are true.
\ 10.  The next two statements are both true.
\ 11.  Exactly 1 of statements 7, 8 and 9 are true.
\ 12.  Exactly 4 of the preceding statements are true.

include lib/bits.4th                   \ for BIT
include lib/bitset.4th                 \ for LASTBIT

12 constant #stat                      \ number of statements
                                       \ encoding of the statements
: s1 >r #stat 12 = r> 0 bit = ;        \ heavy use of binary
: s2 >r r@ 4032 and bitcount 3 = r> 1 bit = ;
: s3 >r r@ 2730 and bitcount 2 = r> 2 bit = ;
: s4 >r r@ 4 bit 0= 96 r@ over and = or r> 3 bit = ;
: s5 >r r@ 14 and 0= r> 4 bit = ;
: s6 >r r@ 1365 and bitcount 4 = r> 5 bit = ;
: s7 >r r@ 1 bit r@ 2 bit xor r> 6 bit = ;
: s8 >r r@ 6 bit 0= 48 r@ over and = or r> 7 bit = ;
: s9 >r r@ 63 and bitcount 3 = r> 8 bit = ;
: s10 >r 3072 r@ over and = r> 9 bit = ;
: s11 >r r@ 448 and bitcount 1 = r> 10 bit = ;
: s12 >r r@ 2047 and bitcount 4 = r> 11 bit = ;
: list #stat 0 do dup i bit if i 1+ . then loop drop ;

: nearmiss?                            \ do we have a near miss?
  over #stat 1- = if                   ( true-pattern #true stat-pattern)
    ." Near miss with statements " dup list ." true (failed "
    >r over invert 1 #stat lshift 1- and lastbit 0 .r ." )" cr r>
  then                                 \ extract the failed statement
;
                                       \ have we found a solution?
: solution?                            ( true-pattern #true stat-pattern)
  over #stat = if ." Solution! with statements " dup list ." true." cr then
;

: 12statements                         \ test the twelve patterns
  1 #stat lshift 0 do                  \ create another bit pattern
    i s12   2* i s11 + 2* i s10 + 2* i s9 + 2* i s8 + 2* i s7 + 2*
    i s6  + 2* i s5  + 2* i s4  + 2* i s3 + 2* i s2 + 2* i s1 +
    dup bitcount i solution? nearmiss? drop drop drop
  loop                                 \ count number of bytes and evaluate
;

12statements
