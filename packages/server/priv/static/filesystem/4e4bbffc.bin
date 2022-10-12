\ Wil Baden's sorter demo (4tH version)

INCLUDE lib/qsort.4th
INCLUDE lib/compare.4th

\  For sorting character strings in increasing order:
: SPRECEDES         ( addr addr -- flag )  >R COUNT R> COUNT COMPARE 0<  ;
: IPRECEDES         ( addr addr -- flag )  < ;

10 constant #elements
#elements array elements

: fill-table #elements 0 do i cells elements + ! loop ;

s" nine"  drop s" four" drop s" three" drop s" seven" drop s" zero" drop
s" eight" drop s" two"  drop s" six"   drop s" one"   drop s" five" drop
fill-table

: str_dump #elements 0 do i cells elements + @ count type space loop ;
cr str_dump .( -> ) ' SPRECEDES IS PRECEDES elements #elements sort cr str_dump

9 4 3 7 0 8 2 6 1 5
fill-table

: int_dump #elements 0 do i cells elements + @ . loop ;
cr int_dump .( -> ) ' IPRECEDES IS PRECEDES elements #elements sort int_dump

