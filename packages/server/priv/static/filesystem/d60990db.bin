\ Copyright Charles A. Gray, 2007
\ A chaotic sequence
\ Qn = Q(n - Q(n-1)) + Q(n - Q(n-2))
\ 1 1 2 3 3 4 5 5 6 6 6 8 8 8 10 9 10 11 11 12 12 12 12 16 14 14

\ I am re-reading "Godel, Escher, Bach: An Eternal Golden Bamd" by
\ Douglas R. Hofstadter and decided to implement his chaotic sequence in
\ Forth as follows:

\ Return the nth term of the chaotic sequence.

: QQ                                   ( n -- Sn )
   DUP 2 < IF
     DROP 0 1
   ELSE
     DUP 1- RECURSE                    \ n Q(n-1)
     OVER - NEGATE RECURSE             \ n Q(n-Q(n-1))
     SWAP                              \ Q(n -Q(n-1)) n
     DUP                               \ ... n n
     2 - RECURSE                       \ ... n Q(n-2)
     SWAP - NEGATE RECURSE             \ ... Q(n - q(n-2))=20
   THEN +
;

: .Chaotic                             ( n -- )
  0 DO  i QQ . SYNC LOOP
;

32 .Chaotic CR
