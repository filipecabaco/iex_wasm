\ Taken from http://rosettacode.org 
\ 4tH version 2014, Hans Bezemer

\ Benford's law, also called the first-digit law, refers to the frequency
\ distribution of digits in many (but not all) real-life sources of data.
\ In this distribution, the number 1 occurs as the first digit about 30% of
\ the time, while larger numbers occur in that position less frequently: 9 as
\ the first digit less than 5% of the time. This distribution of first digits
\ is the same as the widths of gridlines on a logarithmic scale. Benford's law
\ also concerns the expected distribution for digits beyond the first, which
\ approach a uniform distribution.

\ For this task, write (a) routine(s) to calculate the distribution of first
\ significant (non-zero) digits in a collection of numbers, then display the
\ actual vs. expected distribution.

\ Use the first 1000 numbers from the Fibonacci sequence as your data set.
\ No need to show how the Fibonacci numbers are obtained. You can generate
\ them or load them from a file; whichever is easiest. Display your actual vs
\ expected distribution.

include lib/3dup3rot.4th               \ for 3DROP
include lib/fp4.4th                    \ for REPRESENT
include lib/fpow10.4th                 \ for 1/F
include lib/flnflog.4th                \ for FLOG

: ftuck fswap fover ;
: f2drop  fdrop fdrop ;
: 1st-fib   0 s>f 1 s>f ;
: next-fib  ftuck f+ ;

: 1st-digit ( fp -- n )
    pad 6 represent 3drop pad c@ [char] 0 - ;

10 array counts does> swap cells + ;

: tally
\    0 counts 10 cells erase   ( does not work properly on 4tH)
    1st-fib
    1000 0 DO
        1 fdup 1st-digit counts +!
        next-fib
    LOOP f2drop ;

: benford ( d -- fp )
    s>f 1/f 1 s>f f+ flog ;

: tab 9 emit ;

: heading  ( -- )
    cr ." Leading digital distribution of the first 1,000 Fibonacci numbers:"
    cr ." Digit" tab ." Actual" tab ." Expected" ;

: .fixed ( n -- ) \ print count as decimal fraction
    s>d <# # # # [char] . hold #s #> type space ;

: report ( -- )
    precision 3 set-precision
    heading
    10 1 DO
        cr i 3 .r
        tab i counts @ .fixed
        tab i benford f.
    LOOP
    set-precision ;
 
: compute-benford  tally report ;

compute-benford cr                     \ no, we didn't forget FCLEAR ;-)