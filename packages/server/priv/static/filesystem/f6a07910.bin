\ Original Date: November 4, 1985
\ Last Modified: January 2, 1989
\ Author:        Jack W. Brown
\ ANS/4tH port:  October 14, 1997
\ Ported by:     Hans L. Bezemer
\ File name:     L4P16.SEQ
\ Function:      Computes Area of a Polygon given the x,y
\                coordinates of its verticies

\ The following mathematical algorithm is often used to
\ determine the area of cross-section provided it can be
\ represented adequately by a finite number of straight line
\ segments (this is almost always possible).  The technique
\ can also be applied to cross-sections with holes by moving
\ around the hole in a counter clockwise direction and traversing
\ to and from the hole along the same path.

\ The general algorithm.

\     p1 /---------\  p2        p1 = ( x1,y1 )
\       /           \           p2 = ( x2,y2 )
\      /             \  p3      p3 = ( x3,y3 )
\     /              /          p4 = ( x4,y4 )
\ p5 /--------------/ p4        p5 = ( x5,y5 )

\ AREA OF THE POLYGON =
\ [(x1y5-x5y1)+(x2y1-x1y2)+(x3y2-x2y3)+(x4y3-x3y4)+(x5y4-x4y5)]/2
\ In general:
\            i=n
\ AREA = 0.5*SUM [ x(i)y(i-1) - x(i-1)y(i) ]
\            i=1
\  where we define x0 to be x5 and y0 to be y5.

\ Example without a hole.
\  X   Not drawn to scale!!
\  |                              p1 = ( 8,4 )
\  |                              p2 = ( 6,1 )
\  |    p4 ----------- p1         p3 = ( 2,1 )
\  |      /          /            p4 = ( 5,4 )
\  |     /          /
\  |    /          /
\  | p3 -----------  p2
\  |-----------------------Y

\ A = [(8*4-5*4)+(6*4-8*1)+(2*1-6*1)+(5*1-2*4)]/2 = 10.5


\ Example of a polygon with a hole removed
\ Sorry but the diagram below is not to scale.   units= centimeters
\       Y
\ p9 ---|-------------------------------- p1     p1 = (6,5)
\    \  |   p5            p4            /        p2 = (2,0) = p8
\     \ |     +----------+            /          p3 = (3,3) = p7
\      \|     |cut out   |          /            p4 = (3,4)
\       \     +----------+        /              p5 = (1,4)
\       |\  p6         p7,p2    /                p6 = (1,3)
\       | \                   /                  p7 = (3,3)
\       |   \               /                    p8 = (2,0)
\       |     \           /                      p9 = (-1,5)
\       |       \       /
\       |         \   /
\       |          \/  p8,p2
\    ---+-------------------------- X

\  Traverse outside clockwise and the cut out counter clockwise.
\  A = [(6*5-(-1)*5)+(2*5-6*0)+(3*0-2*3)+(3*3-3*4)+(1*4-3*4)
\                   +(1*4-1*3)+(3*3-1*3)+(2*3-3*0)+(-1*0-2*5)]/2
\  A = 15.5 sq cm


\ This should be replaced by the bullet proof version in the
\ file JBINPUT.SEQ

[NEEDS lib/enter.4th]

51 ARRAY X              \ Array for x coordinates
51 ARRAY Y              \ Array for y coordinates

VARIABLE  #POINTS       \ Number of points in polygon
VARIABLE  AREA          \ Sum of the x(i)y(i-1) - x(i-1)y(i)

\ Fetch ith x component.
: X@  ( i     x{i} ) CELLS X + @ ;

\ Fetch ith y component.
: Y@  ( i     y{i} ) CELLS Y + @ ;

\ Store ith x component.
: X!  ( x i     -- ) CELLS X + ! ;

\ Store ith y component.
: Y!  ( y i     -- ) CELLS Y + ! ;

\ Move to the next tab stop.
: TAB ( -- ) 9 emit ;

\ Get number from keyboard.
: GET# ENTER ;

\ Prompt and fetch number of data points.
: GET_#POINTS  ( -- )
        BEGIN
        CR ." Enter number of data points. "
        GET#  DUP 3 <
        WHILE  CR ." You need at least 3 data points!"
        REPEAT  50 MIN #POINTS ! ;


\ Prompt and fetch all data points.
: GET_DATA      ( -- )
        CR CR ." Point " CR
        #POINTS @ 1+ 1
        DO   CR I 3 .R  TAB ." X = " GET# I X!
             TAB ." Y = " GET# I Y! LOOP
        #POINTS @ DUP X@ 0 X! Y@ 0 Y! ;  \ Store last point in 0th slot

\ Sum data points.
: FIND_AREA   ( -- )
        0 AREA !
        #POINTS @ 1+  1         ( n+1 so we loop n times )
        DO I    X@ I 1- Y@ *    ( X{i}*Y{i-1} )
           I 1- X@ I    Y@ *    ( X{i-1}*Y{i} )
           - AREA +!
        LOOP  ;


\ Display computed area.
: PUT_AREA      ( -- )
        AREA @ 2 /MOD
        CR ." AREA = " 6 .R  [CHAR] . EMIT
        IF [CHAR] 5 EMIT ELSE [CHAR] 0 EMIT THEN SPACE ;

\ Compute area of polygon.
: POLY     ( -- )
        GET_#POINTS
        GET_DATA
        FIND_AREA
        PUT_AREA ;

POLY

