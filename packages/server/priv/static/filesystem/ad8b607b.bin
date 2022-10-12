\ ------------------------------------------------
\ kisstest.4th - try random generator

include lib/gmkiss.4th

: p1 dup hex . decimal . cr ;

: show4
2swap swap p1 p1
swap p1 p1
;

123456789
362436069
521288629
916191069
seed4!


s" 4tH version" type cr cr

s" Seeds" type cr
seed4@ show4 cr

s" Rands" type cr
kiss p1 cr

s" Seeds" type cr
seed4@ show4

\ example input and output
\ MPE VFX Forth for Windows IA32

\ Seeds
\ 123456789 
\ 362436069 
\ 521288629 
\ 916191069 

\ Rands
\ 543309434 

\ Seeds
\ -1440872530 
\ -1141009226 
\ 275137954 
\ 1956946454 
\  ok