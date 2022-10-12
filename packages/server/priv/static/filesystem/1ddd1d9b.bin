\ arcfour.4th
\ ARCFOUR - Alleged RC4

\                                Neil Bawd 1997-05-25 2000-07-16

0 [IF]
To compete with the many appearances of RC4, a Forth
version should be a CODE definition for speed.  In this CODE
definition, there is no stack movement. It is more than 4.5
times as fast as the colon version above.

    CREATE Arcfour-State  2 CELLS 256 CHARS + ALLOT
    
    : MACRO                  \ "name <char> ccc<char>" -- 
        :   CHAR PARSE POSTPONE SLITERAL  POSTPONE EVALUATE
        POSTPONE ; IMMEDIATE
        ;
    
    MACRO &I " Arcfour-State "
    MACRO &J " Arcfour-State CELL+ "
    MACRO &S " Arcfour-State 2 CELLS + " 
    
    CODE ARCFOUR  \ char -- code 
        \  RX    i
        \  RY    j
        \  R30   S[i] finally S[S[i]+S[j]]
        \  R31   S[j]
        \  R29   &i, then &S, then char, then code
    
        \  Save local registers.
        R31 -4 RRSP STWU,
        R30 -4 RRSP STWU,
        R29 -4 RRSP STWU,
    
        \  RTOS = Arcfour-State
        RTOS  -4 RDSP  STWU,       \ . .
        ['] Arcfour-State info-find-token @infoDataOffset
            R29 LiteralToRegister,
            R29 RDBP ADD,
    
        \  To get a new i, add 1.
        RX 0 R29 LWZ,        \  rx = i
        RX RX 1 ADDI,        \  rx = rx + 1
        RX 0 R29 STW,        \  i = rx
        RX RX 255 ANDI.,     \  rx = rx mod 256
    
        \  To get a new j, add the array byte at the new i.
        R29 R29 8 ADDI,      \  rtos = &S
        R30 R29 RX LBZX,     \  r30 = S[i]
        RY  -4 R29 LWZ,      \  ry = j
        RY  RY R30 ADD,      \  ry = ry + S[i]
        RY  RY 255 ANDI.,    \  ry = ry mod 256
        RY  -4 R29 STW,      \  j = ry
    
        \  Swap the array bytes at i and j.
        R31  R29 RY LBZX,
        R30  R29 RY STBX,
        R31  R29 RX STBX,
    
        \  The code is the array byte at the sum of the
        \  array bytes at i and j.
        R30 R31 ADD,
        R30 R30 255 ANDI.,
        R30 R29 R30 LBZX,
    
        \  XOR with plaintext or ciphertext byte.
        RTOS R30 XOR,
    
        \  Restore local registers.
        R29 0 RRSP LWZ,
        R30 4 RRSP LWZ,
        R31 8 RRSP LWZ,
        RRSP 12 ADDI,
    
        NEXT, END-CODE
    
    \ Definition of ARCFOUR-INIT copied from above.
[THEN]

include lib/arcfour.4th

\ This is one of many tests to validate the code.  It 
\ works with any correct version of `ARCFOUR`.

64 STRING KEY:

: !KEY ( c1 c2 ... cn n -- store the specified key of length n )
	KEY: + DUP 0 SWAP C! KEY: 1- SWAP 1- ?DO I C! -1 +LOOP ;
  
[HEX] HEX 61 8A 63 0D2 0FB  DECIMAL 5 !KEY

KEY: COUNT ARCFOUR-INIT

CR
HEX 0DC ARCFOUR .
    0EE ARCFOUR .
    04C ARCFOUR .
    0F9 ARCFOUR .
    02C ARCFOUR .
DECIMAL

CR .( Should be: F1 38 29 C9 DE )
\ CR .( Should be: Fox 1; 3 8; 2 9; Charlie 9; Dog Easy. ) 

\  End of ARCFOUR
