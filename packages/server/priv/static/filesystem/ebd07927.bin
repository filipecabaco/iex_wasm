\ xlap.fs
\ 2D PROBLEM  DIV(GRAD(V))=0, RECTANGULAR DOMENIUM
\ EXPOSED BY  KRISHNA MYNENI  ON EXAMPLE PDE1.4TH
\     - SQUARE SHAPED CELLS OF DOMENIUM -
( ON P4 3GHz  GFORTH 0.6.2  CYGWIN CONSOLE:
$ time gforth-fast -e "include xlap.fs iter bye"

real    0m1.419s
user    0m1.421s
sys     0m0.031s
to view:
$gforth-fast -e "include xlap.fs iter print bye" > lap.plot
$ gnuplot
gnuplot> set contour
gnuplot> splot  "lap.plot" matrix
)

include lib/anscore.4th

\ UNIT OF MEASURE  -  1mV, WE DON'T NEED AN EXPLICIT ERROR LIMIT
0    CONSTANT V0
50000  CONSTANT V1  ( mV )
100000 CONSTANT V2  ( mV )

6  CONSTANT #X   \ NR. ROWS
6  CONSTANT #Y   \ NR. COLS

#X #Y * 2 *  CONSTANT  #MEM
#MEM ARRAY MEM

( EX: #X=6 #Y=6
           N
          ---
    0  1  2  3  4    5
      -------------
    6 | 7  8  9 10| 11
 | 12 |13 14 15 16| 17 |
W| 18 |19 20 21 22| 23 |E
 | 24 |25 26 27 28| 29 |
      -------------
   30 31 32 33 34   35
          ---
           S
)
\ WE HAVE 4 SUBDOMENIUMS MAKED UP BY DOMENIUM CELLS OF INDEXES:
\ 1. [7,11) , 2. [13,17) , 3. [19,23) , 4. [25,29)
( EACH DOMENIUM CELL OCCUPY 2 CELLS OF DICTIONARY MEMORY:
  ONE FOR "BACK-STORE" AND THE OTHER "CURRENT".

  FOR EACH ITERATION THROUGH DOMENIUM WE HAVE TO SWAP
 "BACK-STORE" WITH "CURRENT" THROUGH "FLIP-FLOP OFFSET"
) 

\ ADRESSES OF SUBDOMENIUMS
#X 2 - CONSTANT #SUBDOM    \ NR. OF  SUBDOMENIUMS
#SUBDOM 2 * ARRAY SUBDOM

\ ------------------------  INIT
: INIT-ADDR  #SUBDOM 0
    DO
        R@ #X * #Y 2 * 1- + 2 *  1+ CELLS MEM +
           ( [2*INDEX+1]CELLS+MEM = VAL)
           R@ 2 *    CELLS SUBDOM + ( ADDR) !
        R@ #X *  #Y 1+ + 2 *  1+ CELLS MEM +
           ( [2*INDEX+1]CELLS+MEM = VAL)
           R@ 2 * 1+ CELLS SUBDOM + ( ADDR) !
    LOOP ;

\ INIT DOMENIUM
: INIT-DOM  MEM #MEM BOUNDS DO 0 I ! LOOP ;

\ DEFINE BOUNDARIES
: INIT-NORTH  MEM  DUP
    #Y 2 * CELLS + SWAP
    DO
        V0 V0 ( VAL) R@ ( ADDR) 2!
    2 CELLS +LOOP ;

: INIT-SOUTH  MEM #X 1- #Y * 2 * CELLS + DUP
    #Y 2 * CELLS + SWAP
    DO
        V1 V1 ( VAL) R@ ( ADDR) 2!
    2 CELLS +LOOP ;

: INIT-WEST #X 0
    DO
        V0 V0 ( VAL)
        R@ #X * 2 *  CELLS MEM + ( ADDR) 2!
    LOOP ;

: INIT-EAST #X 0
    DO
        V2 V2 ( VAL)
        R@ #X *   #Y 1- + 2 *  CELLS MEM + ( ADDR) 2!
    LOOP ;

: INIT INIT-ADDR INIT-DOM INIT-NORTH INIT-SOUTH INIT-EAST
INIT-WEST ;
INIT
\ --------------------------- DO CLEANUP

\ FLIP-FLOP OFFSET
 0 CELLS VALUE  FLIP
-1 CELLS VALUE  FLOP
: DO-FLIP.FLOP  FLIP 1 CELLS / -1 XOR CELLS TO FLIP
                FLOP 1 CELLS / -1 XOR CELLS TO FLOP ;

\ CELL ITERATION, RETURN CONVERGENCE FLAG
: CELL-ITER  ( T|F ADDR -- T'|F' )
    >R
    R@ #Y 2 * CELLS -  FLOP + @
    R@ #Y 2 * CELLS +  FLOP + @ +
    R@  2 CELLS -  FLOP + @ +
    R@  2 CELLS +  FLOP + @ +
    4 / DUP
    R@  FLIP + !
    R>  FLOP + @ ( CONVERGENCE CHECK )
    = AND ;

\ SUBDOMENIUM ITERATION, RETURN CONVERGENCE FLAG
: SUBDOM-ITER ( T|F ADDR-HI ADDR-LO -- T'|F' )
    DO  R@ CELL-ITER  2 CELLS +LOOP ;

\ DOMENIU ITERATION, RETURN CONVERGENCE FLAG
: DOM-ITER ( T|F -- T'|F' )
    #SUBDOM 0
    DO
        R@ 2 * CELLS SUBDOM + ( ADDR ) DUP @
        SWAP
        1 CELLS + ( ADDR) @
        SUBDOM-ITER
    LOOP ;

\ MANY ITERATIONS :)
: ITER  BEGIN  -1 DOM-ITER DO-FLIP.FLOP  UNTIL ;

\ PRINT RESULT
: PRINT-LINE ( #LINE -- )
   #Y * 2 * CELLS MEM +  DUP
   #Y 2 * CELLS +        SWAP
   DO
        R@ @ .
   2 CELLS +LOOP CR ;

: PRINT ( -- )
  #X 0  DO  R@ PRINT-LINE LOOP ;

iter print
