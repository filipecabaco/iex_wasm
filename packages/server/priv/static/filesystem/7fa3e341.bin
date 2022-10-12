\ Merge Sort
\ Taken from http://rosettacode.org 
\ 4tH version 2011, Hans Bezemer

[UNDEFINED] sort     [IF]
[UNDEFINED] precedes [IF]
  defer precedes                       \ compatible with QSORT
[THEN]

: merge-step                           ( right mid left -- right mid+ left+ )
  over @ over @ precedes if
    over @ >r
    over over - over dup cell+ rot smove
    r> over !
    >r cell+ over over = r> swap if drop dup then
  then cell+ ;

: merge                                ( right mid left -- right left )
  dup >r begin over over > while merge-step repeat 2drop r> ;
                                       ( l r -- mid )
: mid over - 2/ 1 cells negate and + ;
 
: mergesort                            ( right left -- right left )
  over over cell+ >
  if swap over over mid recurse rot recurse merge then ;
                                       ( addr len -- ) 
: sort cells over + swap mergesort 2drop ;

[DEFINED] 4TH# [IF]
  hide merge-step
  hide merge
  hide mid
  hide mergesort
[THEN]
[THEN]
