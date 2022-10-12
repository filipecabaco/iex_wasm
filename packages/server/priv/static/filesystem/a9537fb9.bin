\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

\ Given an Array, derive a sequence of elements in which all duplicates are
\ removed. The word unique, if given a sorted array of cells, will remove the
\ duplicate entries and return the new length of the array. For simplicity,
\ unique has been written to process cells (which are to Forth what "int" is
\ to C), but could easily be modified to handle a variety of data types
\ through deferred procedures, etc. The input data is assumed to be sorted.

include lib/srtstack.4th

\ Increments a2 until it no longer points to the same value as a1
\ a3 is the address beyond the data a2 is traversing.
: skip-dups ( a1 a2 a3 -- a1 a2+n )
    dup rot ?do
      over @ i @ <> if drop i leave then
    1 cells +loop ;
 
\ Compress an array of cells by removing adjacent duplicates
\ Returns the new count
: unique ( a n -- n2 )
   over >r             \ Original addr to return stack
   cells over + >r     \ "to" addr now on return stack, available as r@
   dup begin           ( write read )
      dup r@ <
   while
      2dup @ swap !    \ copy one cell
      cell+ r@ skip-dups
      >r cell+ r>      \ increment write ptr only
   repeat  r> 2drop  r> - 1 cells / ;

9 constant /test
/test array test

: .test ( n -- ) 0 ?do test i cells + ? loop cr ;

1  2  3  2  6  4  5  3  6 /test ascending
test /test bounds do i ! loop 
test /test 2dup unique .test
