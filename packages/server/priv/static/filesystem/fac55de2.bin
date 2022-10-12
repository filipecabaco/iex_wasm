\ 4tH library - Simple Timsort - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] sort    [IF]
include lib/ins2sort.4th               \ get insertionsort
aka sort insertsort                    \ and rename it
hide sort

32 constant (run)                      \ size of a partition

: merge-step                           ( right mid left -- right mid+ left+ )
  over @ over @ precedes if
    over @ >r
    over over - over dup cell+ rot smove
    r> over !
    >r cell+ over over = r> swap if drop dup then
  then cell+ ;
                                       ( right mid left -- right left )
: merge dup >r begin over over > while merge-step repeat 2drop r> ;

: sort                                 ( a n)
  2dup cells bounds ?do i (run) i' i - min insertsort (run) cells +loop

  dup (run) ?do                        ( a n)
    dup 0 ?do                          ( a n)
      2dup stow i j 2* + min cells +   ( a n a a+right)
      swap i cells + tuck j cells +    ( a n a+left a+right a+mid)
      over over > if rot merge else drop then drop drop
    j 2* +loop                         \ make sure there's something to merge
  i +loop 2drop                        ( --)
;

[DEFINED] 4TH# [IF]
  hide merge-step
  hide merge
  hide (run)
[THEN]
[THEN]