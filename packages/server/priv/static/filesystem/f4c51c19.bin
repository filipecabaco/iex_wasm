\ Derived from the article "Random Number Generation" by Chris Lomont
\ C implementation in the public domain
\ 4tH implementation by Hans Bezemer, 2017

\ static unsigned long state[16];
\ static unsigned int index = 0;

\ unsigned long WELLRNG512(void)
\ {
\   unsigned long a, b, c, d;
\   a = state[index];
\   c = state[(index+13)&15];
\   b = a^c^(a<<16)^(c<<15);
\   c = state[(index+9)&15];
\   c ^= (c>>11);
\   a = state[index] = b^c;
\   d = a^((a<<5)&0xDA442D24UL);
\   index = (index + 15)&15;
\   a = state[index];
\   state[index] = a^b^d^(a<<2)^(b<<18)^(c<<28);
\   return state[index];
\   }

[UNDEFINED] well512 [IF]
[UNDEFINED] UL+     [IF] include lib/constant.4th [THEN]

 0 value (idx)                         \ keeps value between calls
16 constant #seed                      \ number of seeds
#seed array seed does> swap cells + ;  \ fill this with random bits
                                       ( n -- x[n])
: well512                              ( -- n)
  (idx) dup >r seed @                  ( a)
  r@ 13 + 15 and seed @                ( a c)
  over 16 lshift over 15 lshift xor xor xor
  r@ 9 + 15 and seed @                 ( b c)
  dup 11 rshift xor                    ( b c)
  over over xor dup r@ seed !          ( b c a)
  dup 5 lshift 1514417444 +UL and xor  ( b c d)
  r> 15 + 15 and dup to (idx) seed >r -rot
  28 lshift over 18 lshift xor xor xor ( n1)
  r@ @ dup 2 lshift xor xor r@ ! r> @  ( n2)
;

[DEFINED] 4TH# [IF] hide (idx) [THEN]
[THEN]

\ 16 0 ?do 16 i - i seed ! loop
\ 100 0 ?do well512 . cr loop depth .