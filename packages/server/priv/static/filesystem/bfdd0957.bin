\ -----------------------------------------------------------
\ Turing-Tape game
\ See http://algorithmicproblemsolving.org/competitions/turing-tape-games/

\ The following data is set up for the T12 problem
\ Adjust for other problems

20 constant tape-size
tape-size array tape

\ Assumes the expansion and contraction R sets are equal in size
\ and symmetrical, which may not be true for future problems

create exp-rset  1 ,  1 , 0 , -1 , 0 ,  1 ,  1 ,
create con-rset -1 , -1 , 0 ,  1 , 0 , -1 , -1 ,
here con-rset - 1 cells / constant R-size
R-size 2 / constant R-offset

\ Assumes starting position is 1 coin in tape position i
: init-tape ( i -- )
    tape tape-size bounds ?do 0 i ! loop
    R-offset + cells tape + 1 swap !
;

: .tape ( -- )
    cr R-offset negate tape-size over + swap
    do i 3 .r loop
    cr tape tape-size cells over + swap
    do
       i @ dup
       if 3 .r else drop 3 spaces then
       1 cells
    +loop
;

: make-move ( i ad -- )
    swap cells tape +        ( -- ad ad2 )
    dup R-size cells + swap  ( -- ad ad3 ad2' )
    do
       dup @c i +!
       cell+ 1 cells         ( -- ad' )
    +loop
    drop
    cr .tape
;

: expand    ( i -- ) exp-rset make-move ;
: contract  ( i -- ) con-rset make-move ;

0 init-tape cr cr .( Starting position) .tape

\ Solution to T12, from above web-site

0  expand   3 expand   6 expand   9  expand
12 expand   9 expand   7 expand   4  expand
8  contract 5 contract 3 contract 0  contract
3  contract 6 contract 9 contract 12 contract

cr cr .( Final position) .tape cr
\ -------------------------------------------------