\ 4tH library - Oyelami sort - Copyright 2014, 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Journal of Applied Sciences Research, 4(6): 760-766, 2008
\ 2008, INSInet Publication
\ A Modified Diminishing Increment Sort for Overcoming the Search for
\ Best Sequence of Increment for Shellsort.
\ Oyelami, M.O.

[UNDEFINED] sort [IF]
include lib/binssort.4th               \ obviously, no sort was included yet
aka sort insertionsort                 \ rename insertionsort
hide sort                              \ now forget the old name

: sort
  over over                            ( array len)
  1- cells over + swap                 ( 'end 'begin)
  begin
    over over >
  while
    over @ over @ precedes
    if over over over @ over @ swap rot ! swap ! then
    swap cell- swap cell+
  repeat drop drop
  insertionsort
;
[THEN]
