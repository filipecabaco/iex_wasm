include lib/locals.4th

\ The examples are taken from the gForth manual. They show how a typical
\ gForth definition can be converted to 4tH.

\ : my.max { n1 n2 -- n3 }
\  n1 n2 > if
\    n1
\  else
\    n2
\  endif ;

: my.max   ( n1:A n2:B -- n)
  2 locals
    :A @ :B @ > if
      :A
    else
      :B
    then @
  end-locals ;

1 10 my.max . cr

\ : strcmp { addr1 u1 addr2 u2 -- n }
\   addr1 addr2
\   u1 u2 min 0
\   ?do { s1 s2 }
\     s1 c@ s2 c@ -
\     ?dup-if
\       unloop exit
\     then
\     s1 char+ s2 char+
\   loop
\   2drop
\   u1 u2 - ;

: strcmp   ( a1:A n1:B a2:C n2:D -- n )
  4 locals
    :A @ :C @
    :B @ :D @ min 0
    ?do
      2 locals
        :A @ c@ :B @ c@ - dup
        if            \ we don't have ?DUP
          end-locals  \ discard LOOP locals
          unloop      \ discard LOOP parameters
          end-locals  \ discard strcmp locals
          exit        \ exit the routine
        else          \ we don't have ?DUP
          drop        \ so we have to drop it
        then
        :A @ char+ :B @ char+
      end-locals      \ free LOOP locals
    loop
    2drop
    :B @ :D @ -
  end-locals ;

: tester
  11 111 2 locals
    s" Hello world" s" Hello world!" strcmp .
    s" Hello world" s" Hello world"  strcmp .
    s" Hello world" s" Hello World"  strcmp . cr
    :A ? :B ? cr      \ prove we're OK
  end-locals ;

tester
