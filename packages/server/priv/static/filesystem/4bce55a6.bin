\ uudecode  V1.1             A Forth version of the Unix utility
\ @(#)uudecode.seq	1.1 21:55:29 11/15/94   EFC

\ Typical usage:
\    s" file.uu" uudecode

\ This program ignores the file mode number that follows the word begin.

\ This is an ANS Forth program requiring:
\      1. The File word set
\      2. The word COMPARE in the String word set.

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ (c) Copyright 1997,2008 HanSoft & Partners - 4tH version

INCLUDE lib/compare.4th

\ buffers and I/O handles
82 string inbuf
82 string outbuf

VARIABLE obp   0 obp !

\    write, putb

: write ( n -- )            \ write n bytes out out-handle
        outbuf swap type
;

: putb ( b -- )              \ put a byte to the output buffer
       outbuf obp @ + C!     \ write if its nearly full
       obp @ 1+ DUP OBP !
       DUP 74 > IF write  0 obp ! ELSE DROP THEN
;

: flushb ( -- )
       obp @ DUP 0> IF write 0 obp ! ELSE DROP THEN
;

[HEX]
\    dec, outdec

: dec ( c -- c )     \ single character decode
      20 - 3F AND ;

[DECIMAL]

: outdec ( bp n -- )    \ output group of 3 bytes from bp
     OVER DUP C@ DEC 4 * SWAP 1+ C@ DEC 16 / OR putb
     DUP 1 > IF
             OVER 1+ DUP C@ dec 16 * SWAP 1+ C@ dec 4 / OR putb
             THEN
     2 > IF
         2 + DUP C@ dec 64 * SWAP 1+ C@ dec OR putb
         ELSE DROP THEN   ;

\   out-loop

: out-loop  ( n -- )        \ output until n is zero
        DUP 0> IF
              inbuf 1+ SWAP BEGIN
                         OVER OVER  outdec
                         3 - SWAP 4 + SWAP
                         DUP 0 <=
              UNTIL DROP
         THEN DROP
;

\  Find the header line

: find_head ( -- )

        BEGIN
          REFILL 0= ABORT" No begin line"
          0 PARSE-WORD inbuf PLACE
          S" begin" inbuf COUNT 5 MIN COMPARE 0=
        UNTIL
;

\ Parse the header line

: $<<    ( addr n1 n2)       \ shift string left by indicated amount
         swap over -        ( a n c-n)
         >r over swap       ( a a n)
         chars + r>         ( a a+n c-n)
         rot place          ( --)
;

: parse_head
        inbuf count -trailing 
        over over 6 $<<     \ next 3 chars are octal number
                  4 $<<     \ now inbuf is the output file name
;

: (disk)                               ( m a n -- )
  rot                                  ( a n m)
  open error? abort" Cannot open file" \ issue message if error
  use
;

\ ====== everything above here could be made private =========================

: uudecode ( -- )

      find_head parse_head
      output inbuf count (disk)

      BEGIN 0 REFILL
            0 PARSE-WORD inbuf PLACE
            DUP IF DROP DROP inbuf C@ dec DUP 0> THEN
         WHILE out-loop
      REPEAT DROP

      flushb
;

: Convert
  argn 2 <>                            \ check arguments
  abort" Usage: UUDECODE [file]"
  input 1 args (disk)                  \ open input file
  uudecode                             \ read file
;

Convert
