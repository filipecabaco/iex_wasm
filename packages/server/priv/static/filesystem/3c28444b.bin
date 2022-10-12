\ fsl-util.4th

\ An auxiliary file for the Forth Scientific Library
\ For 4tH ANS floating point

\ Contains commonly needed definitions for the FSL modules.

\ -FROT                    reverse the effect of FROT
\ F2DUP                    FDUP two floats
\ F2DROP                   FDROP two floats
\ F1.0                     floating point constant
\ sd*                      single * double = double_product
\ INTEGER, DOUBLE, FLOAT   for setting up array types
\ FSL-ARRAY                for declaring FSL arrays
\ }                        for getting an FSL ARRAY element address
\ PRINT-WIDTH              number of elements per line for printing arrays
\ }IPRINT  }FPRINT         print out integer or fp arrays
\ }FCOPY                   copy one array into another
\ }FPUT                    move values from fp stack into an array
\ FSL-MATRIX               for declaring an FSL 2-D array
\ }}                       gets a Matrix element address
\ }}IPRINT  }}FPRINT       print out an integer or fp matrix
\ }}FCOPY                  copy one matrix into another
\ }}FPUT                   move values from fp stack into a matrix

\ This file is based on the file "fsl-util.fth" written by Skip Carter
\ in 1994 and released by him to the public domain.  It has been revised
\ to work with both Gforth (0.6.2) and PFE (0.33.69) by Krishna Myneni
\ with contributions from David Williams and Guido Draheim. It has been
\ revised to work with 4tH (3.5d) by Hans Bezemer.
\ This file is released to the public domain.

\ Revisions:
\   1995-07-07  efc; Revision 1.15
\   1996-06-12  efc; Revision 1.17
\   2003-11-16  km;  Fixed bug in }}, added }}FCOPY 
\   2004-02-12  mh;  Applied fixes to } and }} given by Marcel Hendrix
\   2007-10-27  km;  save base, switch to decimal, and restore base;
\                    also defined S>F here, and added note about deprecated
\                    words V: and DEFINES
\   2008-09-18  km;  conditional definitions of cell-, FLOAT, and F,
\   2008-09-22  km;  special handling of FORTH-WORDLIST for PFE; fix defn of PI
\   2008-09-25  km;  revised definition of F, to avoid alignment problem with
\                    floating point locals --- thanks to Guido Draheim and DNW.
\   2008-09-29  dnw;km  revised defn. of F, to act on FALIGNed addresses,
\                    and revised defns of FRAME! and |FRAME to deal with
\                    alignment of HERE; environmental checks for
\                    FLOATING-EXT (used for auto-loading fp words in PFE)
\                    and FLOATING-STACK.
\   2008-10-07  cgm; added definitions for F2* , F2/ , F= , F@DUP , F2DROP, }}IPRINT;
\                    re-organized the file; alternate method of defining fp locals.
\   2008-11-27  hb;  Converted to 4tH; removed several words.
\   2011-11-29  hb;  Changed documentation concerning :REDO.
\   2012-10-28  hb;  Changed documentation and declaration concerning v3.62.0
\   2016-09-24  hb:  Removed DBLBIN.4TH words

\ The code conforms with ANS requiring:
\   1. Words from the wordsets CORE, CORE-EXT, BLOCK-EXT, EXCEPTION-EXT,
\       FILE, FLOAT, FLOAT-EXT and TOOLS-EXT
\   2. [DEFINED] and [UNDEFINED] from the F200X Floating-Extension set

\ ( FSL-UTIL          V2.0       7 October 2008 )

[UNDEFINED] fsl-array [IF]
[UNDEFINED] f.        [IF] [ABORT] [THEN]
  [DEFINED] ZenFP     [IF] [ABORT] [THEN]

\ ================= compilation control =============================

\ for control of conditional compilation of Dynamic memory
[DEFINED] allocate CONSTANT MEMORY-WORDS?

\ ================= FSL NonANS words ================================

: -FROT FROT FROT     ;
: F2DUP  FOVER FOVER ;
: F2DROP  FDROP FDROP ;
: F1.0 1 S>F ;

: sd*   ( multiplicand multiplier_double -- product_double )
        >R OVER R> * >R   UM*   R> +  ;    \ single * double = double

\ ================= function vector definition ======================
\ Removed for 4tH
\ ================= file and vocabulary management ==================
\ Removed for 4tH
\ ================= array words =====================================

1 CELLS CONSTANT INTEGER               \ size of a regular integer
2 CELLS CONSTANT DOUBLE                \ size of a double integer
1 CELLS CONSTANT POINTER               \ size of a pointer (for readability)

\ Usage:
\ An FSL array of 10 FLOATs:
\   10 FLOATS 1+ ARRAY MyFSL     ( allocation)
\   FLOAT MyFSL FSL-ARRAY        ( initialization)
\   :REDO MyFSL (FSL-ARRAY) ;    ( runtime behavior)
\ Original declaration:
\   10 FLOAT MARRAY MyFSL

\ 1-D array definition
\    -----------------------------
\    | cell_size | data area     |
\    -----------------------------

: FSL-ARRAY ( cell_size addr -- )      \ monotype array
  !
;

: (FSL-ARRAY) CELL+ ; ( -- addr )

: }   ( addr n -- addr[n])             \ word that fetches 1-D array addresses
        OVER CELL-  @ * + 
;

VARIABLE print-width      6 print-width !

: }iprint ( n addr -- )                \ print n elements of an integer array
        SWAP 0 DO I print-width @ MOD 0= I 0<> AND IF CR THEN
                  DUP I } @ . LOOP
        DROP
;

: }fprint ( n addr -- )       \ print n elements of a float array
        SWAP 0 DO I print-width @ MOD 0= I 0<> AND IF CR THEN
                  DUP I } F@ F. LOOP
        DROP
;

: }fcopy ( 'src 'dest n -- )           \ copy one array into another
     0 DO      OVER I } F@     DUP  I } F!    LOOP
        2DROP
;

: }fput ( r1 ... r_n n 'a -- )         \ store r1 ... r_n into array of size n
     SWAP DUP 0 ?DO   1- 2DUP 2>R } F! 2R>   LOOP  2DROP ;

\ Usage:
\ An FSL matrix of 16 by 8 FLOATs:
\   16 8 * FLOATS 2 + ARRAY MyFSL  ( allocation)
\   16 8 FLOAT MyFSL FSL-MATRIX    ( initialization)
\   :REDO MyFSL (FSL-MATRIX) ;     ( runtime behavior)
\ Original declaration:
\   16 8 FLOAT MMATRIX MyFSL

\ 2-D array definition,

\ Monotype
\    ------------------------------
\    | m | cell_size |  data area |
\    ------------------------------

: FSL-MATRIX  ( n m size addr -- )     \ defining word for a 2-d matrix
  ROT OVER ! CELL+ ! DROP
;

: (FSL-MATRIX) CELL+ CELL+ ; ( -- addr)

: }}    ( addr i j -- addr[i][j] )     \ word to fetch 2-D array addresses
               >R >R
               DUP CELL- DUP @ SWAP CELL- @
               R> * R> + * +           \ &a[0][0] size m
;

: }}iprint ( n m addr -- )             \ print nXm elements of an integer 2-D array
        ROT ROT SWAP 0 DO    DUP 0 DO    OVER J I  }} @ .
                                   LOOP
                             CR
                       LOOP
        2DROP
;


: }}fprint ( n m addr -- )             \ print nXm elements of a float 2-D array
        ROT ROT SWAP 0 DO    DUP 0 DO    OVER J I  }} F@ F.
                                   LOOP
                             CR
                       LOOP
        2DROP
;

: }}fcopy ( 'src 'dest n m  -- )       \ copy nXm elements of 2-D array src to dest
        SWAP 0 DO    DUP 0 DO    >R OVER R> SWAP J I  }} F@
                                 OVER   J I  }} F!
                           LOOP
               LOOP
        DROP 2DROP
;

: }}fput ( r11 r12 ... r_nm  n m 'A -- | store r11 ... r_nm into nxm matrix )
      -ROT 2DUP * >R 1- SWAP 1- SWAP }} R> 
      0 ?DO  DUP >R F! R> FLOAT -  LOOP  DROP ;

\ ================= Floating-point local variables ==================
\ Removed for 4tH
[THEN]
\                   end of file
