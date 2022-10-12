\ Taken from http://rosettacode.org 
\ 4tH version 2014, Hans Bezemer

\ The Chinese remainder theorem is a result about congruences in number theory
\ and its generalizations in abstract algebra. It was first published in the
\ 3rd to 5th centuries by Chinese mathematician Sun Tzu.

\ In its basic form, the Chinese remainder theorem will determine a number n
\ that when divided by some given divisors leaves given remainders. For
\ example, what is the lowest number n that when divided by 3 leaves a
\ remainder of 2, when divided by 5 leaves a remainder of 3, and when divided
\ by 7 leaves a remainder of 2.

\ Your task is to write a program to solve a system of linear congruences by
\ applying the Chinese Remainder Theorem. If the system of equations cannot be
\ solved, your program must somehow indicate this. (It may throw an exception
\ or return a special false value.) Since there are infinitely many solutions,
\ the program should return the unique solution s 

include lib/locals.4th                 \ for LOCALS
include lib/mixed.4th                  \ for FM/MOD

[DEFINED] 4TH# [IF]                    \ implementation dependant stuff
: gmod >r dup 0< 1- invert r> fm/mod drop ;
-19 constant msg#
[ELSE]                                 \ works with gForth
: gmod >r dup s>d r> fm/mod drop ;
-24 constant msg#
[THEN]

: egcd                                 ( a b -- a b )
    dup IF
        dup -rot /mod                  \ -- b r=a%b q=a/b
        -rot recurse                   \ -- q (s,t) = egcd(b, r)
        >r swap r@ * - r> swap         \ -- t (s - q*t)
    ELSE
        2drop 1 0
    THEN ;

: egcd>gcd  ( a b x y -- n )           \ calculate gcd from egcd
    rot * -rot * + ;

: mod-inv  ( a m -- a' )               \ modular inverse with coprime check
    2dup egcd over >r egcd>gcd r> swap 1 <> 1- invert msg# and throw ;
                                       \ note "1- INVERT" is a 4tH-ism!
: array-product                        ( adr count -- n )
    1 -rot  cells bounds ?DO i @ * 1 cells +LOOP ;

: crt-from-array                       ( adr1 adr2 count -- n )
    2dup array-product 4 locals
    0                                  \ result
    :C @ 0 DO
        :B @ i cells + @
        dup :D @ swap /
        dup rot mod-inv *
        :A @ i cells + @ * +
    LOOP :D @ gmod
    end-locals ;

10 array crt-residues[]
10 array crt-moduli[]

: crt ( .... n -- n )                  \ takes pairs of "n (mod m)" from stack.
    10 min  1 locals
    :A @ 0 DO
        crt-moduli[] i cells + !
        crt-residues[] i cells + !
    LOOP
    crt-residues[] crt-moduli[] :A @ crt-from-array
    end-locals ;

10 11  4 12  12 13  3 crt . cr
\ 10 11  4 22   9 19  3 crt . cr       ( Note this exits with an error!!)