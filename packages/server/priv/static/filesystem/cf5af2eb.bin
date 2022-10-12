\  Copyright : Albert van der Horst by Gnu Public Licence
\ $Id: meteor.frt,v 1.1 2007/01/09 17:24:00 albert Exp albert $
\ Uses Stallman convention for comment.
\ REQUIRE BOUNDS
\ REQUIRE MARKER

\ "meteor" 'EVALUATE CATCH DROP

include lib/anscore.4th

\ For BUFFER and INDEX, return ADDRESS of cell index.
: [] CELLS + ;

\ There is no decent html about this, but here it goes.
\ http://shootout.alioth.debian.org/gp4/benchmark.php?test=meteor<=...
\ This should allow to understand the puzzle.
\ Basically it is a puzzle about fitting together hexagonal pieces.

\ A solution which fills the 5 times 10 plane, and also defines
\ which pieces there are, and how they are named.
: solution0 S" 00001222012661126155865558633348893448934747977799" ;

\ We are using fixed point coordinates where the distance between
\ centers is 100.

\ Distance between centers
50 CONSTANT dx/2        \ Half of distance between horizontal centers.
86 CONSTANT dy          \ Sin(pi/3) scaled by 100.
5  CONSTANT rl          \ Length of row in hexagons.

\ 5 vectors for the 5 points of a metomino.
10 ARRAY buffer
VARIABLE ^buffer

\ Print the buffer for debugging.
: .buffer S"       X    Y" TYPE CR
    5 0 DO I 2 .R buffer I 2* [] 2@ 5 .R  5 .R CR LOOP ;

\ Add COORDINATE to ``buffer'' keeping track using `` ^buffer ''.
: buffer! ^buffer @ !   1 CELLS ^buffer +! ;

\ Split I into vertical and horizontal components and store into ``buffer''
: coord!   5 /MOD DUP dy * >R 2 MOD SWAP 2* + dx/2 * buffer! R> buffer! ;

\ Extract the piece indicated with CHARACTER, results are
\ coordinates in ``BUFFER''.
: extract   buffer ^buffer ! solution0 0 DO
        2DUP I + C@ = IF I coord! THEN
    LOOP 2DROP ;

\ For X and Y coordinates return linear INDEX.
\ This is for a situation of a normal grid, 0 0 protrudes to the left.
: >index    dy 2/ + dy / >R  \ row index
     dx/2 +   dx/2 R@ 2 MOD * -   dx/2 2* /  \ col index
     R> rl * + ;

\ For X and Y coordinates return linear INDEX.
\ This is for an abnormal grid where the second row protrudes.
: abnormal>index    dy 2/ + dy / >R  \ row index
     dx/2 +   dx/2 R@ 1+ 2 MOD * -   dx/2 2* /  \ col index
     R> rl * + ;

\ Convert the coordinates in ``buffer'' to a bit-pattern,
\ where each bit represent the next hexagon. Return PATTERN.
: >bits  0 \ No bits.
  10 0 DO 1 buffer I [] 2@ SWAP >index LSHIFT OR 2 +LOOP ;

\ Convert the coordinates in ``buffer'' to a bit-pattern,
\ where each bit represent the next hexagon. Return PATTERN.
\ This is for the abnormal situation.
: abnormal>bits  0 \ No bits.
  10 0 DO 1 buffer I [] 2@ SWAP abnormal>index LSHIFT OR 2 +LOOP ;

\ Show the BITS, but in the same order they appear in `` solution0 ''.
: .bits  BEGIN DUP 1 AND [CHAR] 0 + EMIT 2/ DUP 0= UNTIL DROP ;

CREATE mat-rot
   50 ,  -86 ,       \ scale by 100
   86 ,   50 ,

CREATE mat-flip
  100 ,    0 ,       \ scale by 100
    0 , -100 ,

CREATE mat-flop
 -100 ,    0 ,       \ scale by 100
    0 , +100 ,

\ Apply the content of `` mat-rot '' to `` buffer ''
\ Effecting a rotation over 60 degrees.
: rot-pi/3  10 0 DO  buffer I [] 2@
   2DUP  mat-rot 0 [] @C * SWAP mat-rot 1 [] @C * + 100 / >R
         mat-rot 2 [] @C * SWAP mat-rot 3 [] @C * + 100 / >R
   R> R> buffer I [] 2!
2 +LOOP ;

\ Final test

char 0 extract >bits .bits CR solution0 TYPE CR CR
char 2 extract >bits .bits CR solution0 TYPE CR CR

char 0 extract
rot-pi/3 >bits .bits
CR
.buffer 