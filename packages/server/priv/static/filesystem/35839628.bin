\ Taken from http://rosettacode.org 
\ 4tH version 2010, Hans Bezemer

[UNDEFINED] shuffle [IF]
[UNDEFINED] choose  [IF]
include lib/choose.4th
[THEN]

: shuffle                              ( deck size -- )
  1 swap do
    dup i choose cells +
    over @ over @  swap
    rot  ! over !
    cell+
  -1 +loop drop ;

: cshuffle                             ( deck size -- )
  1 swap do
    dup i choose chars +
    over c@ over c@  swap
    rot  c! over c!
    char+
  -1 +loop drop ;
[THEN]
