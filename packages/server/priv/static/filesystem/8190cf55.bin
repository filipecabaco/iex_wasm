\ ------------------------------------------------------------
\ matcher.fs
\ ------------------------------------------------------------

\ From: Julian Fondren <julian.fondren@gmail.com>
\ Date: Saturday 30 September 2017 07:28:03
\ Groups: comp.lang.forth

\ Believed to be in the public domain

[UNDEFINED] match [IF]
[UNDEFINED] 2over [IF] include lib/anscore.4th [THEN]

\ -- constant matching
: cmatch                               ( c-addr u c -- c-addr' u' | 0 0 )
  over if                              \ not empty string or failed match
    >r over r> swap c@ = if chop else drop >zero dup then
  else                                 \ ensure return is failed match ( 0 0 )
    drop nip 0                         \ even if it was only an empty string
  then ;                               ( a 0 )

: match                                ( 'abc' 'ab' -- 'c' | 0 0 )
  bounds ?do i
    c@ cmatch
  loop ;

: xt-match                             ( c-addr u xt -- c-addr' u' | 0 0 )
  over if
    >r over r> swap c@ swap execute if chop else drop >zero dup then
  else drop nip 0 then ;

\ -- optional matching
: optional                             ( a u a u -- a u )
  over if 2nip else 2drop then ;

\ usage: match-string 2DUP match-attempt OPTIONAL

\ -- results of matching
: matched                              ( a1 u1 a2 u2 -- a3 u3 )
  over if
    nip -
  else
    drop nip nip 0
  then ;

\ usage: match-string 2DUP match-attempt MATCHED

\ -- repeated matching
: any-matches                          ( a u xt -- a u )
  >r begin
    2dup r@ execute over
  while
    2nip
  repeat 2drop r> drop ;

: some-matches                         ( a u xt -- a u )
  >r r@ execute r> any-matches ;

\ -- matching wherever
: find-match                           ( a u xt -- a u )
  >r begin
    2dup r@ execute over if 2nip r> drop ;then 2drop dup
  while
    chop
  repeat r> drop nip 0 ;

\ xt     r@                            ( a u -- f )
\ xt-do  r'@                           ( a u -- )

: each-match                           ( a u xt xt-do -- )
  >r >r
  begin
    dup
  while
    2dup r@ execute over if
      2over 2over matched r'@ execute 2nip
    else
      2drop chop
    then
  repeat 2r> 2drop 2drop ;

: each-overlapping-match               ( a u xt xt-do -- )
  >r >r
  begin
    dup
  while
    2dup 2dup r@ execute over if
      matched r'@ execute
    else
      2drop 2drop
    then chop
  repeat 2r> 2drop 2drop ;
[THEN]