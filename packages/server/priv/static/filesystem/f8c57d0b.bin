\ Range extraction - Copyright 2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ A format for expressing an ordered list of integers is to use a comma
\ separated list of either:
\   * individual integers
\   * Or a range of integers denoted by the starting integer separated
\     from the end integer in the range by a dash, '-'. (The range includes
\     all integers in the interval including both endpoints)
\   * The range syntax is to be used only for, and for every range that
\     expands to more than two values.

here
create values
    0 ,  1 ,  2 ,  4 ,  6 ,  7 ,  8 , 11 , 12 , 14 ,
   15 , 16 , 17 , 18 , 19 , 20 , 21 , 22 , 23 , 24 ,
   25 , 27 , 28 , 29 , 30 , 31 , 32 , 33 , 35 , 36 ,
   37 , 38 , 39 ,
here swap - 1 cells / 1- value /values

: .range2 0 .r ." -" 0 .r ;
: .range1 0 .r ." , " 0 .r ;
: .range0 drop 0 .r ;
: clip 1- swap cell+ swap ;            \ reduce array

create .range ' .range0 , ' .range1 , ' .range2 ,
  does> >r over over - 2 min cells r> + @c execute ;

: .ranges                              ( a n --)
  over @c dup >r >r                    \ setup first value
  begin
    clip dup                           \ check length
  while
    over @c dup r@ 1+ =                \ check if range breaks
    if r> drop >r else r> r> .range ." , " dup >r >r then
  repeat drop drop r> r> .range cr     \ print last value
;

values /values .ranges

\ create values                          \ gForth version
\ here
\    0 ,  1 ,  2 ,  4 ,  6 ,  7 ,  8 , 11 , 12 , 14 ,
\   15 , 16 , 17 , 18 , 19 , 20 , 21 , 22 , 23 , 24 ,
\   25 , 27 , 28 , 29 , 30 , 31 , 32 , 33 , 35 , 36 ,
\   37 , 38 , 39 ,
\ here swap - 1 cells / constant /values

\ : clip 1- swap cell+ swap ;            \ reduce array
\ : .range2 0 .r ." -" 0 .r ;
\ : .range1 0 .r ." , " 0 .r ;
\ : .range0 drop 0 .r ;

\ create .range ' .range0 , ' .range1 , ' .range2 ,
\   does> >r over over - 2 min cells r> + @ execute ;

\ : .ranges                              ( a n --)
\   over @ dup >r >r                     \ setup first value
\   begin
\     clip dup                           \ check length array
\   while
\     over @ dup r@ 1+ =                 \ check if range breaks
\     if r> drop >r else r> r> .range ." , " dup >r >r then
\   repeat 2drop r> r> .range cr         \ print last range
\ ;
