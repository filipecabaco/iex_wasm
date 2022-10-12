\ (c) 1982 by Ing. W. Hofacker, adapted by J.L. Bezemer
\ Lists the contents of an area in dump format ( a n --)

[UNDEFINED] dump [IF]
variable dump_offset                   \ determines the offset shown

[HEX]
: init. dup dup 10 + swap ;
: .hex   init. hex do i c@ <# # # bl hold #> type loop decimal ;
: .ascii init. do i c@ bl max 7E min emit 2 spaces loop ;
: hdump cr dup dump_offset @ + 4 .r space .hex cr 7 spaces .ascii 10 + ;
: dump 10 / cr cr 5 spaces 10 0 do i 3 .r loop cr 0 do hdump loop drop ;
[DECIMAL]

[DEFINED] 4tH# [IF]
  hide init.
  hide .hex
  hide .ascii
  hide hdump
[THEN]
[THEN]
