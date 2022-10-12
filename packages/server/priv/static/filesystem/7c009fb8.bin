\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

[UNDEFINED] pangram? [IF]
[UNDEFINED] within   [IF]
include lib/range.4th
[THEN]

: pangram? ( addr len -- ? )
  0 -rot bounds do
    i c@ 32 or [char] a -
    dup 0 26 within if
      1 swap lshift or
    else drop then
  loop
  1 26 lshift 1- = ;
[THEN]

\ s" The five boxing wizards jump quickly." pangram? . 
\ s" The quick brown fox jumped over the lazy dogs" pangram? .