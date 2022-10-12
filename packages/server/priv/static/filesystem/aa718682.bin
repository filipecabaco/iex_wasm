\ Converts Wil Baden's "LET fortran-stytle-equations:" constructs to 4tH.
\ This program has been superseded by PP4tH v3.64.0 and later.
 
\  From Wil Baden's comments in OPG.txt:
\    There is just one end-user word `LET`.  The formula is
\    terminated by `:`.  (`LET` and `:` have been adopted from
\    Basic.) 
\               Examples of Use

\  Operator Precedence goes through the expression putting out
\  operands as it reaches them and saving operators.  Operators
\  are put out when an operator of less or equal precedence is
\  reached.  Thus higher precedence is performed before lower
\  precedence.

\      Float array a   Float array b  Float array c
\      Float array x   Float array w

\      : TEST0   CR  LET b+c;  FE.
\                CR  LET b-c;  FE.
\                CR  LET 10000000*(b-c)/(b+c);  FE.
\                ;

\      LET b = 3;
\      LET c = 4;
\      TEST0

\      : TEST1   LET a = b*c-3.17e-5/TANH(w)+ABS(x);  CR  LET a; F. ;

\      LET w = 1.e-3;  LET x = -2.5;  CR CR  test1

\      Float array HALFPI
\      LET HALF PI = 2*ATAN(1);
\      LET HALF PI + |FDUP|; F.

\      Float array disc                ( Used for discriminant )

\      : QUADRATICROOT                 ( F: a b c -- r1 r2 )
\          c F!  b F!  a F!            \ Pickup coefficients.
\          LET disc = SQRT(b*b-4*a*c); \ Set discriminant.
\          LET (-b+disc)/(2*a), (-b-disc)/(2*a);
\                                      \ Put values on f-stack.
\          ;

\      ( Solve x*x-3*x+2 )  LET QUADRATICROOT (1,-3, 2) ; F. F.
\      ( Find goldenratio ) LET MAX(QUADRATICROOT (1,-1,-1)) ; F.

\      ( You can also write ) 1.E -1.E -1.E QUADRATICROOT FMAX F.

\      : FACTORIAL                     ( n -- )( F: -- r )
\          LET w = 1;  LET x = 1;
\          0 ?DO  LET w = w * x;  LET x = x + 1;  LOOP
\          LET w; ;

\      ( Another way )
\      : FACTORIAL                     ( n -- )( F: -- r )
\         LET w = 1;  0 ?DO  LET w = w * | I 1+ S>D D>F |;  LOOP
\         LET w; ;
\      6 FACTORIAL F.  ( or ) LET FACTORIAL(|6|); F.
\ ======================================================================

include lib/compare.4th 
include lib/opgftran.4th 
 
 : parse-word-count ( c -- a n n2)    \ n2 characters were skipped
    >in @  >r 
    parse-word 
    >in @ r> - over  - 1-
    0 max                             \ for consistent results if "last" word
 ; 

: Usage abort" Usage: opgconv infile outfile " ; 
: Read-file refill ; 
: PreProcess  ( -- )  float-math ;    \ can also use: standard-math
: Process 
    begin 
       bl parse-word-count  spaces dup 
     while 
       2dup  s" let" compare 0= 
       if 2drop [char] ; parse  ftran then 
       type space 
     repeat 
     2drop cr ; 
 
[needs lib/convert.4th] 

