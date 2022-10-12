\ ANEW --MT19937--                              \  Wil Baden  2003-01-31

\  *******************************************************************
\  *                                                                 *
\  *  Makoto Matsumoto and Takuji Nishimura  2002-01-09              *
\  *                                                                 *
\  *          Mersenne Twister 2002 Update                           *
\  *                                                                 *
\  *  http://www.math.keio.ac.jp/matumoto/MT2002/emt19937ar.html     *
\  *                                                                 *
\  *  Generate sequence of "random" numbers with a cycle of          *
\  *  2^19937-1.  That is 6002 decimal digits.                       *
\  *                                                                 *
\  *  Each block of 19937 bits is different.  Every possible block   *
\  *  (except all zeros) is generated.                               *
\  *                                                                 *
\  *  This is a tempered linear congruential sequence of binary      *
\  *  vectors of length 19937 bits.                                  *
\  *                                                                 *
\  *    A C-program for MT19937, with initialization improved        *
\  *    2002/1/26. Coded by Takuji Nishimura and Makoto Matsumoto.   *
\  *                                                                 *
\  *    Before using, initialize the state by using                  *
\  *    init_genrand(seed) or init_by_array(init_key, key_length).   *
\  *                                                                 *
\  *    C version copyright (C) 1997 - 2002, Makoto Matsumoto and    *
\  *    Takuji Nishimura, All rights reserved.                       *
\  *                                                                 *
\  *  Converted to Standard Forth by Wil Baden, 2003-01-30.          *
\  *  Converted to 4tH by Hans Bezemer, 2014-10-04                   *
\  *                                                                 *
\  *   genrand_int31  genrand_real1  genrand_real3   init_by_array   *
\  *   genrand_int32  genrand_real2  genrand_real53  init_genrand    *
\  *                                                                 *
\  *******************************************************************

\          Billions and Billions of Random Numbers

\  In 1997, Makoto Matsumoto and Takuji Nishimura developed the
\  Mersenne Twister. The Mersenne Twister is "designed with
\  consideration of the flaws of various existing generators," has a
\  super-astronomical period of 2^19937 - 1, gives a sequence that is
\  623-dimensionally equidistributed, and "has passed many stringent
\  tests, including the die-hard test of G. Marsaglia and the load
\  test of P. Hellekalek and S. Wegenkittl."  It is efficient in
\  memory usage (typically using 2506 bytes of static data, and the
\  code is quite short as well).  It generates random numbers in
\  batches of 624 at a time, so the caching and pipelining of modern
\  systems is exploited. It is also divide- and mod-free.

\  REFERENCE

\    M. Matsumoto and T. Nishimura,

\    "Mersenne Twister: A 623-Dimensionally Equidistributed Uniform
\    Pseudo-Random Number Generator",

\    ACM Transactions on Modeling and Computer Simulation,
\    Vol. 8, No. 1, January 1998, pp 3--30.

[UNDEFINED] genrand_int32 [IF]
[UNDEFINED] FDUP [IF] [ABORT] [THEN]

[DEFINED] ZenFP  [IF]
  include lib/zenfsqrt.4th
  include lib/zentodbl.4th
[THEN]

\  *******************************************************************
\  *                        Period Parameters                        *
\  *******************************************************************

624 CONSTANT  N
397 CONSTANT  M

[HEX]
1908B0DF +UL CONSTANT  MATRIX_A    \  constant vector a
00000000 +UL CONSTANT  UPPER_MASK  \  most significant w-r bits
7FFFFFFF     CONSTANT  LOWER_MASK  \  least significant r bits

N ARRAY MT                 \  the array for the state vector
N 1+ VALUE MTI             \  mti==N+1 means mt[N] is not initialized

\  *******************************************************************
\  *                  init_genrand  init_by_array                    *
\  *******************************************************************

\  init_genrand      ( s -- )
\     initialize mt[N] with a seed

\  init_by_array     ( &init_key key_length -- )
\     initialize by an array with array-length
\     init_key is the array for initializing keys
\     key_length is its length

: init_genrand      ( s -- )
    7FFFFFFF +UL AND  MT !
    N 1 DO
        6C078965                       \  Borosch-Niederreiter
            MT I 1- th @  dup 01E RSHIFT  XOR  *  I +
        MT I th !
        \  See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. In the
        \  previous versions, MSBs of the seed affect only MSBs of
        \  the array mt[]. 2002/01/09 modified by Makoto Matsumoto
        MT I th dup @ 7FFFFFFF +UL AND  SWAP !
        \  for >32 bit machines
    LOOP
    N TO MTI ;

: init_by_array     ( &init_key key_length -- )
    012BD6AA init_genrand
    N over > IF  N  ELSE  dup  THEN  >R  ( R: k)
    0 1                                    ( &init_key key_length j i)
    0 R> ( 1 k) DO
        dup 1- cells MT + @
        dup 01E RSHIFT XOR
        019660D *
        over cells MT + @ XOR
        >R >R >R over R> R> over >R rot R> CELLS + @  R> +
        >R over R> swap +
        over cells MT + !              \ non-linear
        dup cells MT + dup @  7FFFFFFF +UL AND  SWAP !
                                       \  for WORDSIZE > 32 machines
        1+ >R  1+ R>
        dup N < 0= IF  N 1- cells MT + @  MT !  DROP 1  THEN
        >R  2dup > 0= IF  DROP 0  THEN  R>
    -1 +LOOP
    0 N 1- DO
        dup 1- cells MT + @
        dup 01E RSHIFT XOR
        5D588B65 *
        over cells MT + @ XOR
        over -
        over cells MT + !
        dup cells MT + dup @  7FFFFFFF +UL AND  SWAP !
                                       \  for WORDSIZE > 32 machines
        1+
        dup N < 0= IF  N 1- cells MT + @  MT !  DROP 1  THEN
    -1 +LOOP
    2drop 2drop
    00000000 +UL MT !  \  MSB is 1; assuring non-zero initial array
    ;

\  *******************************************************************
\  *                  genrand_int32  genrand_int31                   *
\  *******************************************************************

\  genrand_int32            ( -- u )
\     generate a random number on [0,0xffffffff]-interval

\  genrand_int31             ( -- u )
\     generate a random number on [0,0x7fffffff]-interval

2 ARRAY MAG01 0 MAG01 MATRIX_A OVER CELL+ ! !
                                       \  mag01[x] = x * MATRIX_A  for x=0,1
: genrand_int32             ( -- u )
    MTI N < 0= IF                      \  generate N words at one time
        MTI N 1+ = IF                  \  if init_genrand() has not been called,
            1571 init_genrand          \  a default initial seed is used
        THEN
        N M -  0  DO
            MT I th @ UPPER_MASK AND  MT I 1+ th @ LOWER_MASK AND  OR
            dup 1 RSHIFT  SWAP  1 AND  cells MAG01 + @ XOR
            MT I M + th @ XOR
            MT I th !
        LOOP
        N 1-  N M -  DO
            MT I th @ UPPER_MASK AND  MT I 1+ th @ LOWER_MASK AND  OR
            dup 1 RSHIFT  SWAP  1 AND  cells MAG01 + @ XOR
            MT I M + N - th @ XOR
            MT I th !
        LOOP
        MT N 1- th @ UPPER_MASK AND  MT @ LOWER_MASK AND  OR
        dup 1 RSHIFT  SWAP  1 AND  cells MAG01 + @ XOR
            MT N 1- th @ XOR  MT N 1- th !
        0 TO MTI
    THEN
    MT MTI th @  MTI 1+ TO MTI
    \  Tempering
    dup 0B RSHIFT XOR
    dup 7 LSHIFT  1D2C5680 +UL AND XOR
    dup 0F LSHIFT 6FC60000 +UL AND XOR
    dup 12 RSHIFT XOR
    ;

: genrand_int31              ( -- u )
    genrand_int32  1 rshift ;

\  *******************************************************************
\  *           genrand_real1  genrand_real2  genrand_real3           *
\  *******************************************************************

\  genrand_real1             ( F: -- r )
\     generate a random number on [0,1]-real-interval

\  genrand_real2             ( F: -- r )
\     generate a random number on [0,1)-real-interval

\  genrand_real3             ( F: -- r )
\     generate a random number on (0,1)-real-interval

FLOAT ARRAY (1/4294967295)
FLOAT ARRAY (1/4294967296)
FLOAT ARRAY (1/9007199254740992)

[DECIMAL]
[DEFINED] ZenFP [IF]
 232830643 -18  2dup (1/4294967295) F! (1/4294967296) F!
1110223024 -25 (1/9007199254740992) F!
[ELSE]
s" 232.83064370807973E-12" s>float (1/4294967295) F!
s" 232.83064365386963E-12" s>float (1/4294967296) F!
s" 111.02230246251565E-18" s>float (1/9007199254740992) F!
[THEN]

: genrand_real1             ( F: -- r )
    genrand_int32 U>D D>F  (1/4294967295) F@ F* ;
    \  divided by 2^32-1

:  genrand_real2             ( F: -- r )
     genrand_int32 U>D D>F (1/4294967296) F@ F* ;
    \  divided by 2^32

: genrand_real3              ( F: -- r )
    genrand_int32 U>D D>F 1 S>F F2/ F+ (1/4294967296) F@ F* ;
    \  divided by 2^32

\  *******************************************************************
\  *                         genrand_real53                          *
\  *******************************************************************

\  genrand_real53             ( F: -- r )
\     generate a random number on [0,1) with 53-bit resolution

: genrand_real53              ( F: -- r )
    genrand_int32 5 RSHIFT  S>F
    67108864 S>F  F*  genrand_int32 6 RSHIFT S>F  F+
    (1/9007199254740992) F@ F* ;

\  These real versions are due to Isaku Wada, 2002/01/09 added

\  *******************************************************************
\  *                                                                 *
\  *                    How Mersenne Twister Works                   *
\  *                                                                 *
\  *******************************************************************

\  A _Mersenne number_ is a number of the form 2^_w_-1.  A _Mersenne
\  prime_ is a Mersenne number that is prime.  A necessary but not
\  sufficient condition for a Mersenne prime is that _w_ is prime.
\  Another condition will make it sufficient.

\  As of May 2000, there are 38 known Mersenne primes.  2^19937-1
\  is the 24th and has 6002 decimal digits.  The 38th is
\  2^6972593-1 and I don't know how many decimal digits.

\  One way to define a linear congruential series is to pick numbers
\  _m_ and _p_, where _p_ is a prime, and _m_ is a "generator" for
\  it.  A generator for a prime _p_ is a number such that its powers
\  modulo _p_ yield all positive numbers less than _p_.  Thus you can
\  start with any positive number less than _p_, and continue
\  multiplying by _m_ to get all positive numbers less than _p_. In
\  the Mersenne Twister, instead of numbers, we are working with
\  vectors of 19937 bits.  In this, the equivalent of a generator is
\  a 19937 by 19937 matrix that can successively multiply any of the
\  vectors that is not all 0 to obtain every vector that is not all
\  0.  The arithmetic is done modulo 2. Addition is _x + y mod 2_ and
\  multiplication is _x * y mod 2_. These are the same as _x xor y_
\  and _x and y_.

\  In the program, `Matrix-A` is a value that can be used to form
\  such a matrix.  The once-every-624-times part of the program takes
\  this value and does calculations that are equivalent to
\  multiplying by the full matrix.

\  This gives 2^19937-1 combinations of 19937 bits.

\  The matrix has the following form, but 19937 by 19937.

\      0 1 0 0 ... 0 0 0
\      0 0 1 0 ... 0 0 0
\      0 0 0 1 ... 0 0 0
\              ...
\      0 0 0 0 ... 1 0 0
\      0 0 0 0 ... 0 1 0
\      a b c d ... x y z

\  The done-every-time part twists the output to obscure the
\  algebraic connection between successive elements.  It's
\  equivalent to multiplying by an invertible 19937 by 19937
\  matrix.

\ genrand_int31             ( -- u )                        MT19937.2002
\    generate a random number on [0,0x7fffffff]-interval

\ genrand_int32             ( -- u )                        MT19937.2002
\    generate a random number on [0,0xffffffff]-interval

\ genrand_real1             ( F: -- r )                     MT19937.2002
\    generate a random number on [0,1]-real-interval

\ genrand_real2             ( F: -- r )                     MT19937.2002
\    generate a random number on [0,1)-real-interval

\ genrand_real3             ( F: -- r )                     MT19937.2002
\    generate a random number on (0,1)-real-interval

\ genrand_real53             ( F: -- r )                    MT19937.2002
\    generate a random number on [0,1) with 53-bit resolution

\ init_by_array              ( &init_key key_length -- )    MT19937.2002
\    initialize by an array with array-length
\    init_key is the array for initializing keys
\    key_length is its length

\ init_genrand               ( s -- )                       MT19937.2002
\    initializes mt[N] with a seed

[DEFINED] 4TH# [IF]
  hide N
  hide M
  hide MATRIX_A
  hide UPPER_MASK
  hide LOWER_MASK
  hide MT
  hide MTI
  hide MAG01
  hide (1/4294967295)
  hide (1/4294967296)
  hide (1/9007199254740992)
[THEN]
[THEN]
