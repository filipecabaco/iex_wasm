\ Cassini 99.01.27 10:35 pm WBZ
\ 4tH version 03.06.26 02:22 pm JLB

[needs lib/time.4th]

: .##/  ( n --)
  <# [char] / hold # # #>
  type ;

: .today ( -- )
  today
  rot  .##/ swap .##/ . ;

: ddays  ( m1 d1 y1 m2 d2 y2 -- n)
  jday >r
  jday r>
  swap - ;

: milestone ( str d m y -- n )
    cr today
    ddays dup >r
    abs 5 .r r> 0<
    if
      ."  days until "
    else
      ."  days since "
    then
    type ;

: .ren  ( -- )
    ."  rendezvous" ;

: .per  ( -- )
    [char] . emit ;

: .launch ( -- )
    s" Launch" 15 10 1997
    milestone .per ;

: .venus1 ( -- )
    s" Venus #1" 26 4 1998
    milestone .ren .per ;

: .venus2 ( -- )
    s" Venus #2" 24 6 1999
    milestone .ren .per ;

: .earth  ( -- )
    s" Earth" 17 8 1999
    milestone .ren .per ;

: .jupiter  ( -- )
    s" Jupiter" 30 12 2000
    milestone .ren .per ;

: .observe ( -- )
    s" Huygens separation."
    6 11 2004 milestone ;

: .htitan ( -- )
    s" Huygens Landing."
    27 11 2004 milestone ;

: .ctitan ( -- )
    s" Cassini/Titan Flyby."
    27 11 2004 milestone ;

: .saturn ( -- )
    s" Saturn" 1 7 2004
    milestone .ren .per ;

: go  ( -- )
    ." Daily Cassini "
    ." Progress Report "
    .today
    cr .launch .venus1 
    .venus2 .earth
    .jupiter .saturn
    .observe .htitan .ctitan ;

go cr

