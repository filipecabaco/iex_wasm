\ Taken from http://rosettacode.org
\ gForth version, 4tH version 2014 Hans Bezemer

include lib/scanskip.4th               \ for SPLIT
include lib/pickroll.4th               \ for PICK
include lib/memchar.4th                \ for ALLOCATE

\ align columns

variable column

: for-each-line ( file len xt -- )
  >r begin 10 split r@ execute chop dup 0> 0= until 2drop r> drop ;

: for-each-field ( line len xt -- )
  0 column !
  >r begin [char] $ split r@ execute 1 column +! chop dup 0> 0= until
  2drop r> drop ;

0 value num-columns

: count-columns ( line len -- )
  [: 2drop ;] for-each-field
  num-columns column @ max to num-columns ;
: find-num-columns ( file len -- )
  0 to num-columns
  ['] count-columns for-each-line ;

0 value column-widths

: column-width ( field len -- )
  column-widths column @ + c@
  max
  column-widths column @ + c!
  drop ;
: measure-widths ( line len -- )
  ['] column-width for-each-field ;
: find-column-widths ( file len -- )
  num-columns allocate throw to column-widths
  column-widths num-columns erase
  ['] measure-widths for-each-line ;

\ type aligned, same naming convention as standard numeric U.R, .R
: type.l ( addr len width -- )
  over -               >r type r>       spaces ;
: type.c ( addr len width -- )
  over - dup 2/ spaces >r type r> 1+ 2/ spaces ;
: type.r ( addr len width -- )
  over -        spaces    type ;

defer type.aligned

: print-field ( field len -- )
  column-widths column @ + c@ type.aligned space ;
: print-line   ( line len -- ) cr ['] print-field for-each-field ;
: print-fields ( file len -- )    ['] print-line  for-each-line ;
                                       \ SLURP replacement
1024 constant /fakefile                \ size of the fake file
/fakefile allocate throw value fakefile
fakefile /fakefile erase               \ initialize the fake file

offset lines                           \ contents of fake file buffer
  c" Given$a$text$file$of$many$lines,$where$fields$within$a$line$" 10 c,
  c" are$delineated$by$a$single$'dollar'$character,$write$a$program" 10 c,
  c" that$aligns$each$column$of$fields$by$ensuring$that$words$in$each$" 10 c,
  c" column$are$separated$by$at$least$one$space." 10 c,
  c" Further,$allow$for$each$word$in$a$column$to$be$either$left$" 10 c,
  c" justified,$right$justified,$or$center$justified$within$its$column." 10 c,
  0 c,                                 \ terminate with NULL character

fakefile /fakefile 0 ?do               \ fill the fake file buffer
  i lines dup if over i chars + c! else drop leave then
loop count                             \ and return its address
                                       \ all set, ready to go
\  scan once to determine num-columns
2dup find-num-columns

\  scan again to determine column-widths
2dup find-column-widths

\  print columns, once for each alignment type
' type.l is type.aligned  2dup print-fields cr
' type.c is type.aligned  2dup print-fields cr
' type.r is type.aligned  2dup print-fields cr

\ cleanup
drop free throw
column-widths free throw
