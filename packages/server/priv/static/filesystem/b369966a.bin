\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

\   1. Take two numbers to be multiplied and write them down at the top of
\      two columns.
\   2. In the left-hand column repeatedly halve the last number, discarding
\      any remainders, and write the result below the last in the same column,
\      until you write a value of 1.
\   3. In the right-hand column repeatedly double the last number and write
\      the result below. stop when you add a result in the same row as where
\      the left hand column shows 1.
\   4. Examine the table produced and discard any row where the value in the
\      left column is even.
\   5. Sum the values in the right-hand column that remain to produce the
\      result of multiplying the original two numbers together 

: e* dup if over 2* over 2/ recurse swap 1 and if + exit then then nip ;

1439 7 e* . cr
