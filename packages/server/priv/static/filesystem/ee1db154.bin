\ Test Forth-94 compliance for >FLOAT

include lib/ansfloat.4th
include lib/fpin.4th

: CHK ( addr len flag )
  >R CR [CHAR] " EMIT 2DUP TYPE [CHAR] " EMIT
  8 OVER - SPACES  >FLOAT DUP >R IF FDROP THEN R>
  ." --> " DUP IF ." TRUE " ELSE ." FALSE" THEN
  R> - IF ."   *fail* " ELSE ."   pass " THEN ;

: TEST ( -- )
  fclear 10 set-precision
  CR ." Checking >FLOAT Forth-94 compliance ..." CR
  S" ."    FALSE CHK
  S" E"    FALSE CHK
  S" .E"   FALSE CHK
  S" .E-"  FALSE CHK
  S" +"    FALSE CHK
  S" -"    FALSE CHK
  S"  9"   FALSE CHK
  S" 9 "   FALSE CHK
  0 0      TRUE CHK
  S"    "  TRUE CHK
  S" 1+1"  TRUE CHK
  S" 1-1"  TRUE CHK
  S" 9"    TRUE CHK
  S" 9."   TRUE CHK
  S" .9"   TRUE CHK
  S" 9E"   TRUE CHK
  S" 9e+"  TRUE CHK
  S" 9d-"  TRUE CHK
;

TEST

\ end