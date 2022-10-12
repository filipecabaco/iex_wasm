\ Virtual memory demo (arrays) - Copyright 2013 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/vmem.4th
include lib/holds.4th

64 constant /row                       \ size per row (multiple of 2, <= 1024)
18 constant #row                       \ number of rows
                                       \ note s1 will be allocated at block 1
variable s1 /row #row * vallot latest ! does> swap /row * +paging ;
variable s2 /row #row * vallot latest ! does> swap /row * +paging ;
                                       \ since it doesn't fit in block 0!
8 s" vmemdemo.scr" create-blockfile    \ create a 8K blockfile
s" vmemdemo.scr" open-blockfile        \ and open it

18 0 ?do                               \ now write to both arrays
  i <# [char] ) hold #S s" ( S1: element " holds #> i s1 place &
  i <# [char] ) hold #S s" ( S2: element " holds #> i s2 place &
loop

save-buffers                           \ write to disk (just to be sure)
                                       \ now display both arrays
18 0 ?do i s1 count type cr i s2 count type cr loop 
                                       \ and clean up the blockfile
s" vmemdemo.scr" delete-file abort" Cannot delete blockfile"
depth .                                \ check for stack leaks