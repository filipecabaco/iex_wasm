\ Virtual memory demo - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/vmem.4th
include lib/ncoding.4th                \ create a bunch of variables
                                       \ in virtual memory
variable s1   32 vallot latest ! does> paging ;
variable s2  128 vallot latest ! does> paging ;
variable s3  128 vallot latest ! does> paging ;
variable s4  512 vallot latest ! does> paging ;
variable n1 nell vallot latest ! does> paging ;
variable s5  100 vallot latest ! does> paging ;
variable s6  256 vallot latest ! does> paging ;
variable n2 nell vallot latest ! does> paging ;

\ Note if you use the preprocessor you can do this much more cleanly:

\ :macro vbuffer: @1@ vallot variable #1# latest ! does> paging ;
\ 32 vbuffer: s1

4 s" vmemtest.scr" create-blockfile    \ create a 4K blockfile
s" vmemtest.scr" open-blockfile        \ and open it
                                       \ now do a few assignments
s" This is the end" s1 place &         \ which span several blocks
1111 n2 n! &                           \ '&' signifies a dirty block
s1 count type cr
n2 n@ . cr
s1 count type cr
s" My only friend" s1 place &
2222 n1 n! &
s1 count type cr                       \ now check their values
n2 n@  . cr
s" , the end" s1 +place &
n2 n@  . cr
s1 count type cr
n1 n@ . cr
                                       \ and clean up the blockfile
s" vmemtest.scr" delete-file abort" Cannot delete blockfile"
depth .                                \ check for stack leaks