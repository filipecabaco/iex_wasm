\ Taken from http://rosettacode.org
\ 4tH version 2012, Hans Bezemer

\ counting change (SICP section 1.2.2) :

table coin-value 0 , 1 , 5 , 10 , 25 , 50 ,
  does> swap cells + @c ;

: count-change ( total coin -- n )
  over 
  if 
    over 0< over 0= or
    if 
      2drop 0
    else
      2dup coin-value - over recurse >r 1- recurse r> +
    then
  else
    2drop 1
  then ;

100 5 count-change .

