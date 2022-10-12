\ Regular Expressions by Brian W. Kernighan and Rob Pike
\ Believed to be in the public domain

\ 4th version by J.L. Bezemer, 2014

[UNDEFINED] match-req [IF]
[UNDEFINED] 2over     [IF] include lib/anscore.4th [THEN]
[UNDEFINED] row       [IF] include lib/row.4th     [THEN]
[UNDEFINED] is-ascii  [IF] include lib/istype.4th  [THEN]
[UNDEFINED] break?    [IF] include lib/breakq.4th  [THEN]

defer (matchhere)

128 +constant +cmd

char ^ +cmd constant (^)               \ all special commands
char ? +cmd constant (?)
char * +cmd constant (*)
char + +cmd constant (+)
char $ +cmd constant ($)
char . +cmd constant (.)
char 9 +cmd constant (9)
char a +cmd constant (@)
char A +cmd constant (a)
char # +cmd constant (#)
char & +cmd constant (&)
char _ +cmd constant (_)

create (eq?)                           \ is it equal?
  (.) , ' is-ascii ,                   \ equivalent to .
  (9) , ' is-digit ,                   \ equivalent to [0-9]
  (@) , ' is-lower ,                   \ equivalent to [a-z]
  (a) , ' is-upper ,                   \ equivalent to [A-Z]
  (#) , ' is-alpha ,                   \ equivalent to [a-zA-Z]
  (&) , ' is-alnum ,                   \ equivalent to [a-zA-Z0-9]
  (_) , ' is-white ,                   \ whitespace
  NULL ,                               \ if a set execute, otherwise compare
does> 2 num-key row if nip cell+ @c execute else drop = then ;
                                       \ some helper words
: (crunch) 1- over over over char+ -rot cmove ;
: (cmd!) over dup c@ +cmd swap c! ;    ( a n -- a n)
: (contains?) 2>r c@ false 2r> bounds break? ;
                                       \ prepare regular expression
: (prepare)                            ( a1 n1 -- a1 n2)
  over swap                            \ save string address
  begin
    dup                                \ any characters left?
  while                                \ if so, does it contain
    over s" ^$?*+." (contains?)        \ a metacharacter?
    if (cmd!)                          \ if so, set command bit
    else dup 1 >                       \ string length at least two?
      if over c@ [char] \ =            \ if it contains an escape
        if (crunch)                    \ ignore the next character
        else                           \ otherwise, if it is marked as
          over c@ [char] % =           \ a set, set the command bit
          if over char+ s" 9aA#&_" (contains?) if (crunch) (cmd!) then then
        then
      then
    then chop                          \ next character
  repeat drop over -                   \ calculate new length
;
                                       \ match zero or more times
: (match*)                             ( a n ra rn c --f)
  begin
    >r 2over 2over (matchhere) if r> drop 2drop 2drop true exit then
    2over if c@ r@ (eq?) else dup xor then r> swap
  while                                \ character equals text?
    >r 2>r chop 2r> r>                 \ if so, match again
  repeat drop 2drop 2drop false        \ clean up, return false
;
                                       \ match zero or one time
: (match?)                             ( a n ra rn c --f)
  >r 2over 2over (matchhere) if r> drop 2drop 2drop true exit then
  2over if c@ r> (eq?) else r> drop dup xor then
  if 2>r chop 2r> (matchhere) else 2drop 2drop false then
;
                                       \ match one or more times
: (match+)                             ( a n ra rn c --f)
  >r 2over if c@ r@ (eq?) if 2>r chop 2r> r> (match*) exit then else drop then
  2drop 2drop r> dup xor               \ check one character then
;                                      \ perform (match*)

create (special?)                      \ all special characters
  (*) , ' (match*) ,
  (?) , ' (match?) ,
  (+) , ' (match+) ,
  NULL ,
does> 2 num-key row                    \ if special character
  if                                   \ execute it
    cell+ @c >r drop over c@ >r chop chop r> r> execute true
  else                                 \ otherwise drop values
    drop drop false                    \ and return false
  then
;

:noname                                ( a n ra rn -- f)
  dup if                               \ regular expression a null string?
    over char+ c@ (special?) if exit then
    over c@ ($) = over 1 = and         \ otherwise does it equal a '$'
    if                                 \ and is it the last character?
      2drop nip 0= exit                \ is so, check length of text
    else                               \ finally, check if any text left
      2over                            \ and if character matches
      if c@ >r over c@ r> swap (eq?) if chop 2>r chop 2r> recurse exit then
      else drop then false             \ if so recurse, otherwise quit
    then                               \ and return false
  else
    true                               \ zero length regular expression
  then >r 2drop 2drop r>               \ clean up and exit
; is (matchhere)                       \ assign to DEFER (we got 'em)

: match-reg                            ( a n ra rn  --f)
  (prepare) dup if over c@ (^) =  if chop (matchhere) exit then then
  begin                                \ if caret, chop it
    2over 2over (matchhere) if 2drop 2drop true exit then
    >r over r> swap                    \ match characters
  while                                \ until no more text
    2>r chop 2r>                       \ chop text
  repeat 2drop 2drop false             \ clean up
;

[DEFINED] 4TH# [IF]
  hide (matchhere)
  hide +cmd
  hide (^)
  hide (?)
  hide (*)
  hide (+)
  hide ($)
  hide (.)
  hide (9)
  hide (@)
  hide (a)
  hide (#)
  hide (&)
  hide (_)
  hide (eq?)
  hide (match*)
  hide (match?)
  hide (match+)
  hide (prepare)
  hide (special?)
  hide (crunch)
  hide (cmd!)
  hide (contains?)
[THEN]
[THEN]
