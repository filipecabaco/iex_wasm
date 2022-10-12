\ Copyright Bernd Beuster, 1996
\ INTEL-HEX-FILE Output

[UNDEFINED] .INTELHEX [IF]
[UNDEFINED] E.LIBERR  [IF] include lib/throw.4th [THEN]
VARIABLE BASE-ADDRESS                  \ base address for EPROM
16 CONSTANT (/LINE)                    \ bytes/line

\ print exactly 2 or 4 digit
: (U.2) ( u -) S>D <# # # #> TYPE ;
: (U.4) ( u -) S>D <# # # # # #> TYPE ;

\ write a line
: (.INTELHEX)                          ( addr1 u - addr2)
\ header
  [CHAR] : EMIT DUP (U.2) BASE-ADDRESS @
  DUP 256 /MOD + >R                    ( RS: checksum )
  (U.4) DUP BASE-ADDRESS +! 0 (U.2)
\ body
  DUP R> + -ROT                        ( checksum addr1 n)
  0 DO DUP CHAR+ SWAP C@  DUP (U.2) ROT + SWAP LOOP
\ tail
SWAP NEGATE 255 AND (U.2) CR ;         ( addr2 checksum)

\ print hex table to console
: .INTELHEX                            ( addr u -)
  BASE-ADDRESS @ >R BASE @ >R HEX
\ save address and base
  (/LINE) /MOD                         \ calculate # lines
  ROT SWAP 0 ?DO (/LINE) (.INTELHEX) LOOP
\ write full lines
  SWAP DUP IF (.INTELHEX) ELSE DROP THEN DROP
\ write last line
  ." :00000001FF" CR R> BASE ! R> BASE-ADDRESS ! ;
\ restore address and base

\ write hex table to file
: WRITE-INTELHEX                       ( addr u1 c-addr u2 -)
  COUT >R OUTPUT OPEN ERROR? E.LIBERR THROW" Can't create Intel file"
  DUP USE >R                           \ create file
  .INTELHEX                            \ do it!
  R> CLOSE R> USE ;                    \ restore output handle

[DEFINED] 4TH# [IF]
  HIDE (/LINE)
  HIDE (U.2)
  HIDE (U.4)
  HIDE (.INTELHEX)
[THEN]
[THEN]
