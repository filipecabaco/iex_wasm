\ Loesung fuer das Weiss-Schwarz-Braun-Raetsel von Martin Gardner uh 2013-07-23
\ Public Domain

\ Prof. Toni Weiss vom Institut fuer Mathematik, Prof. Kim Schwarz, Philosophie,
\ und Uli Braun vom Universitaets-Sekretariat sassen beim Mittagessen zusammen.
\ "Ist es nicht bemerkenswert", sagte die Dame, "dass unsere Nachnamen
\ Schwarz, Weiss und Braun sind und dass ausserdem auch noch einer von uns
\ schwarzes, einer braunes und einer weisses Haar hat?"
\ "In der Tat -", antwortete die Person mit dem schwarzen Haar, "und ist Dir
\ auch aufgefallen, dass keiner von uns die Haarfarbe hat, die zu seinem Namen
\ passt?"
\ "Menschenskind, Du hast recht!", rief Prof. Weiss aus. Wenn nun das Haar der
\ Dame nicht braun ist, welche Haarfarbe hat dann Prof. Schwarz?

include lib/pickroll.4th

0 Constant weiss
1 Constant schwarz
2 Constant braun

: .haarfarbe                           ( n -- )
  dup 0 = IF drop ." weisses Haar" EXIT THEN
  dup 1 = IF drop ." schwarzes Haar" EXIT THEN
  drop ." braunes Haar" ;

: .name                                ( n -- )
  dup 0 = IF drop ." Prof. Toni Weiss" EXIT THEN
  dup 1 = IF drop ." Prof. Kim Schwarz" EXIT THEN
  drop ." Uli Braun" ;

: .anrede                              ( f -- )
  IF ." Frau "  ELSE ." Herr " THEN ;

\ Die Darstellung von Situationen

\                     /----------- Wer ist die Dame (0: Prof. Weiss,
\                     |            1: Prof. Schwarz, 2: Uli Braun)
\                     | /--------- Haarfarbe von Uli Braun
\                     | |
\                     | | /------- Haarfarbe von Prof. Schwarz
\                     | | |
\                     | | | /----- Haarfarbe von Prof. Weiss
\                     | | | |
\                     V V V V
: gbsw ( situation -- g b s w )
  3 /mod                               ( g situation1 )
  3 /mod                               ( g b situation2 )
  3 /mod ;                             ( g b s w ) 

                                       \ Welche Haarfarbe hat eine Person?
: haarfarbe                            ( situation person -- haarfarbe )
  >r gbsw r> pick >r 2drop 2drop r> ;
                                       \ Wer ist weiblich?
: dame                                 ( situation -- person )
  gbsw 2drop drop ;
                                       \ Welche Haarfarbe hat die Dame?
: dame-haarfarbe                       ( situation -- haarfarbe )
  dup dame  haarfarbe ;

: .situation                           ( situation -- )
  3 0 DO ( situation )
    cr ."     "
    I over dame = .anrede
    I .name ."  hat "  dup
    I haarfarbe .haarfarbe ." ."
  LOOP                                 ( situation )
  drop ;

\ Die Bedingungen                      \ 1. Jede der drei Haarfarben ist einmalig.
: haarfarben-einmalig?  >r             ( situation -- f )
  r@ weiss haarfarbe  r@ schwarz haarfarbe  <>
  r@ weiss haarfarbe  r@ braun haarfarbe  <> and
  r@ schwarz haarfarbe r> braun haarfarbe  <> and ;
                                       \ 2. Jede Person hat eine Haarfarbe, die sich
                                       \    von ihrem Namen unterscheidet.
: haarfarben-unpassend? >r             ( situation -- f ) 
  r@ weiss haarfarbe weiss <>
  r@ schwarz haarfarbe schwarz <> and
  r> braun haarfarbe braun <> and ;
                                       \ 4. Die Dame hat kein schwarzes Haar
: dame-haar-!schwarz?                  ( situation -- f )
  dame-haarfarbe schwarz <> ;
                                       \ 5. Die Dame ist nicht Professor Toni Weiss
: dame-nicht-prof-weiss?               ( situation -- f )
  dame weiss <> ;
                                       \ 6. Hat Professor Toni Weiss schwarze Haare?
: weiss-haar-!schwarz?                 ( situation -- f )
  weiss haarfarbe schwarz <> ;
                                       \ 7. Die Dame hat kein braunes Haar
: dame-haar-!braun?                    ( situation -- f )
  dame-haarfarbe braun <> ;

\ Test einer Situation auf Zulaessigkeit
: loesung? >r                          ( situation -- f )
  r@ haarfarben-einmalig?
  r@ haarfarben-unpassend? and
  r@ dame-haar-!schwarz? and
  r@ dame-nicht-prof-weiss? and
  r@ weiss-haar-!schwarz? and
  r> dame-haar-!braun? and ;

\ Das Raetsel, probiere alle 81 Situationen
3                                      ( Haarfarben fuer Prof. Weiss )
3 *                                    ( Haarfarben fuer Prof. Schwarz )
3 *                                    ( Haarfarben fuer Uli Braun )
3 *                                    ( Moeglichkeiten, wer die Dame ist )
Constant #situationen

: wsb                                  ( -- )
  #situationen 0
  DO
    I loesung? IF  cr cr ." Loesung:" I .situation THEN
  LOOP ;

cr .( Raetsel loesen..) wsb cr