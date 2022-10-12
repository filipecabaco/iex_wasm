\ YiQing.4th .. Yi Qing Oracle 4tH Version
\ Copyright (c) 1990, 1994 Jack J. Woehr
\ P.O. Box 51, Golden, Colorado 80402-0051
\ jax@well.sf.ca.us 72203.1320@compuserve.com
\ SYSOP RCFB (303) 278-0364 2400/9600/14400
\ All Rights Reserved
\ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\ This is free software and can be modified and redistributed under
\ certain conditions described in the file COPYING.TXT. The
\ Disclaimer of Warranty and License for this free software are also
\ contained in the file COPYING.TXT.
\ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

INCLUDE lib/random.4th

2 CONSTANT YIN 3 CONSTANT YANG

: YIN? YANG MOD 0<> ;
: YANG? YIN MOD ;

: STALK DUP YANG? SWAP YIN? ;
: YARROW ABS 4 MOD 6 + ;

: RIGHTEOUS YARROW STALK ;

: PLACES
   8 SPACES DUP ." ***"
   IF ." ***" ELSE 3 SPACES THEN ." ***" ;

: BREAKS
   3 SPACES SWAP
   IF DROP ELSE IF ." -0-" ELSE ." -X-" THEN THEN ;

: READING PLACES BREAKS CR ;

: ORACLE RANDOMIZE CR CR 6 0 DO RANDOM RIGHTEOUS READING LOOP ;

ORACLE
