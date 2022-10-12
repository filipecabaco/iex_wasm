[DEFINED] TestZen [IF]
include lib/zenfloat.4th
include lib/zenans.4th
[ELSE]
include lib/ansfloat.4th
[THEN]

include lib/fpin.4th
include lib/fpout.4th

: CHECK ( addr len flag )
  >R CR [CHAR] " EMIT 2DUP TYPE [CHAR] " EMIT
  8 OVER - SPACES  >FLOAT DUP >R IF F. THEN R>
  ." --> " DUP IF ." TRUE " ELSE ." FALSE" THEN
  R> - IF ."   *fail* " ELSE ."   pass " THEN ;

: TEST ( -- )
  CR ." Checking ..." CR 21 SPACES ." ANS"
  S" ."    FALSE CHECK
  S" .1."  FALSE CHECK
  S" E"    FALSE CHECK
  S" E0"   FALSE CHECK
  S" .E"   FALSE CHECK
  S" .E-"  FALSE CHECK
  S" +"    FALSE CHECK
  S" +."   FALSE CHECK
  S" -"    FALSE CHECK
  S"  9"   FALSE CHECK
  S" 9 "   FALSE CHECK
  0 DUP     TRUE CHECK
  S"    "  TRUE CHECK
  S" 1+1"  TRUE CHECK
  S" 1-1"  TRUE CHECK
  S" 9"    TRUE CHECK
  S" 9."   TRUE CHECK
  S" .9"   TRUE CHECK
  S" 9.9"  TRUE CHECK
  S" 9E"   TRUE CHECK
  S" 9e1"  TRUE CHECK
  S" 9D"   TRUE CHECK
  S" 9E+"  TRUE CHECK
;

fclear TEST cr
depth .
[UNDEFINED] ZenFP [IF]
fdepth .
[THEN]
cr

