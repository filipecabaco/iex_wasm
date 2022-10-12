\ cr
\ .( Permutations & Combinations. Version FSL1.0  27th October 1994) cr
\ .(         Gordon Charlton - gordon@charlton.demon.co.uk) cr
\ cr

\ Forth Scientific Library Algorithm #59

\ (c) Copyright 1994 Gordon R Charlton.  Permission is granted by
\ the author to use this software for any application provided this
\ copyright notice is preserved.

\ ANS Forth Program.
\ Requiring the Double-Number word set (namely M*/).
\ Requiring .( ?DO \ from the Core Extensions word set.

[UNDEFINED] perms [IF]
[UNDEFINED] mu*   [IF] include lib/mixed.4th [THEN]

: perms ( u1 u2--ud)  1 u>d 2SWAP
                       SWAP 1+ DUP ROT -
                       ?DO  I mu*  LOOP ;

\ return nPr, where u1=n u2=r. All arguments are unsigned, result is double.

\ This is an iterative version of the recurrence;
\      r=0 --> nPr = 1
\      r>0 --> nPr = nP(r-1)(n-r+1)


VARIABLE (temp)  \ private to combs

: combs ( u1 u2--ud)  1 u>d 2SWAP
                       2DUP - MIN
                       SWAP (temp) !
                       1+ 1 ?DO  (temp) @  I M*/
                                 -1 (temp) +!
                            LOOP ;

\ return nCr, where u1=n u2=r. All arguments are unsigned, result is double.

\ This is an iterative version of the recurrence;
\      r=0 --> nCr = 1
\      r>0 --> nCr = nC(r-1)(n-r+1)/r

\ This recurrance was chosen in favour of the more common
\      nCr = n!/(n-r)! r!
\ to avoid excessively large intermediate results. Use of integer maths
\ necessitates that the multiplication be done before the division, to avoid
\ truncation errors, hence the use of M*/, which has a triple length
\ intermediate result. Advantage is taken of the symmetry of the function
\ to minimise the number of iterations.

\ end of Permutations & Combinations.

[DEFINED] 4TH# [IF] hide (temp) [THEN]
[THEN]