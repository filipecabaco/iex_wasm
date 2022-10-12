\ Fred Behringer, 2012
\ Believed to be in the public domain

include lib/glocal.4th

[hex] hex
variable xxx                           \ define global variable XXX
4711 xxx !                             \ initialize XXX
                                       \ Example 1: a single local variable
: zzz                                  ( -- )
  xxx @ .                              \ print value of XXX
  xxx local{                           \ convert XXX into a local variable
    0815 xxx !                         \ store 0815 in local version of XXX
    xxx @ .                            \ print (local) value of XXX
  }global                              \ restore global value XXX
  xxx @ . cr ;                         \ check (global) value of XXX

variable xx1 4711 xx1 !
variable xx2 4712 xx2 !
variable xx3 4713 xx3 !
                                       \ Example 2: three local variables
: www                                  ( -- )
\ --------------------------------------------------
  xx3 @ .                              \ print value of XX3
  xx3 local{                           \ convert XX3 into a local variable
    0817 xx3 !                         \ store 0817 in local version of XX3
    xx3 @ .                            \ print (local) value of XX3

\ ==================================================
    xx1 @ .                            \ print value of XX1
    xx1 local{                         \ convert XX1 into a local variable
      0815 xx1 !                       \ store 0815 in local version of XX1
      xx1 @ .                          \ print (local) value of XX1
    }global                            \ restore global value XX1
    xx1 @ .                            \ check (global) value of XX1

\ ------------------------------------------
    xx2 @ .                            \ print value of XX2
    xx2 local{                         \ convert XX2 into a local variable
      0816 xx2 !                       \ store 0816 in local version of XX2
      xx2 @ .                          \ print (local) value of XX2
    }global                            \ restore global value XX2
    xx2 @ .                            \ check (global) value of XX2

\ ==================================================
  }global                              \ restore global value XX3
  xx3 @ . cr ;                         \ check (global) value of XX3
\ --------------------------------------------------

zzz www [decimal] decimal
\ Output: 4711 815 4711
\ Output: 4713 817 4711 815 4711 4712 816 4712 4713

