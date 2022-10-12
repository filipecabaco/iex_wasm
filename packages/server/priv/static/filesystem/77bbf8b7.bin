include lib/range.4th
include lib/pickroll.4th

\ Linear Interpolation
\ Copyright 2002, Chris Jakeman
\ 4tH version - Copyright 2009, Hans Bezemer

\ The new Source Code Index lists several ways to extract data from a table of
\ data points and estimate the values in between the entries. In this example,
\ the data points provide the sine of an angle, with 8 data points are used to
\ span a full right-angle. (Linear Interpolation is fast and suitable for any
\ function, but do check that your Forth doesn't provide the function
\ (eg FSIN) already.)

\ For the scheme to work, the X interval between data points must be a power
\ of 2. In this example, it is 24 or 16. We do as much work as possible at 
\ compile time. Each entry in the data table contains 2 values, the Y value
\ corresponding to X and also the Y' - Y value, dY, which is the increase in
\ Y to reach the next data point. We can fetch both values at once using 2@c.

 4 CONSTANT Bits/Step \ 2^4 = 16
15 CONSTANT BitMask   \ Ie. Binary 00001111

create SinTable \ Sample table for 2^10 x Sin(X*128/90)
\ Preamble
   BitMask , Bits/Step ,        \ used by Interpolate
         0 ,       129 ,        \ Min and max+1 limits to X
\ Data Points
\ Y                X         X'
       200 ,         0 ,
       192 ,       200 ,
       177 ,       392 ,
       155 ,       569 ,
       127 ,       724 ,
        95 ,       851 ,
        58 ,       946 ,
        20 ,      1004 ,
         0 ,      1024 ,

: 2@c dup cell+ @c swap @c ;

: Interpolate ( X*128/90 Table -- result*2^10 )
    swap                         \ -- Table X
    over 2@c                     \ Get Bits/Step and BitMask from table
    2 pick and                   \ Extract lower bits
    over >r >r                   \ Stash them and Bits/Step
    rshift                       \ Fast divide of higher bits gets index
    2 cells *                    \ Index down the table
    4 cells +                    \ Skip past the preamble
    + 2@c                        \ Get pair of values for entry
    r> *                         \ Calc interpolation
    r> 1- rshift 1+ 1 rshift     \ Add 1 during division to round result
    +                            \ Add dY to Y
;
: SafeInterpolate ( X &Table -- Result )
    2dup 2 cells + 2@c within abort" Outside range of look-up table"
    Interpolate
;
: Sin ( Angle*8/90 – Sin{A}*1024 )
    SinTable SafeInterpolate
;
39 Sin . .( should = 469 )
