\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

include lib/enter.4th

: factors ( n -- )
  2
  begin  2dup dup * >=
  while  2dup /mod swap
         if   drop  1+ 1 or    \ next odd number
         else -rot nip  dup .
         then
  repeat
  drop . ;

." Enter number: " enter factors cr