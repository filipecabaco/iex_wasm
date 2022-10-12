\ Multi block file test - Copyright 2013, Hans Bezemer

8 constant #blocks
[pragma] debug-blk
include lib/multiblk.4th

s" test.scr" sconstant myblocks

16 myblocks create-blockfile
myblocks open-blockfile

s" ( Block #0, modification 0)" 0 buffer swap cmove update
s" ( Block #1, modification 0)" 1 buffer swap cmove update
s" ( Block #2, modification 0)" 2 buffer swap cmove update
s" ( Block #3, modification 0)" 3 buffer swap cmove update
s" ( Block #4, modification 0)" 4 buffer swap cmove update
s" ( Block #5, modification 0)" 5 buffer swap cmove update
s" ( Block #6, modification 0)" 6 buffer swap cmove update
s" ( Block #7, modification 0)" 7 buffer swap cmove update
s" ( Block #8, modification 0)" 8 buffer swap cmove update
s" ( Block #9, modification 0)" 9 buffer swap cmove update
s" ( Block #A, modification 0)" 10 buffer swap cmove update
s" ( Block #B, modification 0)" 11 buffer swap cmove update
s" ( Block #C, modification 0)" 12 buffer swap cmove update
s" ( Block #D, modification 0)" 13 buffer swap cmove update
s" ( Block #E, modification 0)" 14 buffer swap cmove update
s" ( Block #F, modification 0)" 15 buffer swap cmove update

.index-blk
close-blockfile

myblocks open-blockfile

8 0 ?do i list loop
s" ( Block #0, modification 1)" 0 buffer swap cmove update
.index-blk

8 list
.index-blk

0 list
.index-blk

7 list
.index-blk

myblocks delete-file abort" Cannot delete block file"
depth .

