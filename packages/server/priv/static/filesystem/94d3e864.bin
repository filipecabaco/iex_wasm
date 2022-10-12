\ 4tH library - MATH - Copyright 2003, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] 10K [IF]
[needs lib/constant.4th]
[THEN]

[UNDEFINED] PI*10K [IF]
31416 CONSTANT PI*10K
VARIABLE XS                            ( square of scaled angle)

: KN    ( n1 n2 -- n3, n3=10000-n1*x*x/n2 where x is the angle)
        XS @ SWAP /                    ( x*x/n2)
        NEGATE * 10K /                 ( -n1*x*x/n2)
        10K +                          ( 10000-n1*x*x/n2)
        ;

: >RAD  ( n1 -- n2, n2 in radian*10K )
        PI*10K * 180 /
        ;

: (SIN) ( x -- sine*10K, x in radian*10K )
        DUP 0< SWAP ABS PI*10K 2 * MOD ( first wrap and clip)
        DUP PI*10K >                   ( 3rd or 4th quadrant?)
        IF SWAP 0= SWAP PI*10K - THEN  ( map to 1st or 2nd quadrant)
        DUP PI*10K 2 / >               ( 2nd quadrant?)
        IF PI*10K SWAP - THEN          ( map to 1st quadrant)
        DUP DUP * 10K / XS !           ( x*x scaled by 10K, save in XS)
        10K 72 KN                      ( last term)
        42 KN 20 KN 6 KN * 10K /       ( terms 3, 2, and 1 times x)
        SWAP IF NEGATE THEN            ( negate when needed)
        ;

: (COS) ( x -- cosine*10K, x in radian*10K )
        ABS PI*10K 2 * MOD             ( first wrap and clip)
        DUP PI*10K >                   ( 3rd or 4th quadrant?)
        IF PI*10K 2 * SWAP - THEN      ( map to 1st or 2nd quadrant)
        DUP PI*10K 2 / > TUCK          ( 2nd quadrant?)
        IF PI*10K SWAP - THEN          ( map to 1st quadrant)
        DUP * 10K / XS !               ( compute and save x*x)
        10K 56 KN 30 KN 12 KN 2 KN     ( serial expansion )
        SWAP IF NEGATE THEN            ( negate when needed)
        ;

: (TAN) ( x -- tangens*10K, x in radian*10K )
        DUP (SIN) 10K *
        SWAP (COS) /
        ;

: SIN   ( degree -- sine*10K )
        >RAD (SIN)                     ( compute sine)
        ;

: COS   ( degree -- cosine*10K )
        >RAD (COS)
        ;

: TAN   ( degree -- tangens*10K )
        >RAD (TAN)
        ;

: SQRT  ( n1 -- n2, n2**2<=n1 )
        0                              ( initial root)
        TUCK                           ( set n1 as the limit)
        ?DO     1+ DUP                 ( refresh root)
                2* 1+                  ( 2n+1)
        +LOOP                          ( add 2n+1 to sum, loop if)
        ;                              ( less than n1, else done)

: LOG2  ( n -- log2 )
        -1 SWAP
        BEGIN
          DUP
        WHILE
          SWAP 1+ SWAP
          1 RSHIFT
        REPEAT DROP
        ;

: EXP   ( n1 n2 -- n1**n2)
        1 -ROT
        BEGIN
          DUP
        WHILE
          2 /MOD >R
          IF
            SWAP OVER * SWAP
          THEN
          DUP * R>
        REPEAT
        DROP DROP
        ;

: EXP2? ( u -- f)
        DUP 1- AND 0=
        ;

[DEFINED] 4TH# [IF]
  hide XS
  hide KN
[THEN]
[THEN]
