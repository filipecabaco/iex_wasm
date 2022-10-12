\ uuencode V1.1              A Forth version of the Unix utility
\ @(#)uuencode.seq	1.1 21:55:34 11/15/94   EFC

\ Typical usage:
\    s" infile.dat" s" outfile.uu" uuencode

\ This program ignores the file mode number that follows the word begin.
\ See the customization section for the proper newline and the coding
\ scheme.  Some UUENCODEs are written so that SPACE characters appear
\ in the encode data, others do not.  This code can be compiled either
\ way depending upon whether a single line in 'enc' is commented out or not.

\ This is an ANS Forth program requiring:
\      1. The File word set
\      2. The word CMOVE in the String word set.

\ (c) Copyright 1994 Everett F. Carter.  Permission is granted by the
\ author to use this software for any application provided this
\ copyright notice is preserved.

\ (c) Copyright 1997,2008 HanSoft & Partners - 4tH version

[DECIMAL]

\ buffers and I/O handles
\ inbuf0 includes count, inbuf starts after count
 1 string inbuf0
81 string inbuf
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

\ Basic Input
\ read from in-handle and return the count
\ return a zero if an error,  result goes to inbuf

: read ( n -- 0->err/n->ok )     \ read n bytes
     inbuf swap accept dup
     inbuf0 C!
;

\       $write
\ write a string to output buffer

: $write  ( $addr count -- )
        0 DO DUP I + C@ putb LOOP DROP
;

\ ===================== CUSTOMIZATION SECTION =============================
: crlf   13 putb 10 putb ;            \ output a CRLF

: unix-newline   10 putb ;            \ output a newline

: newline  unix-newline ;             \ set to either unix-newline or crlf



[HEX]
: enc ( c -- c )     \ single character encode
      3F AND 20 +

      \ comment out the next line for alternate (with blanks) encoding
\      DUP 20 = IF 40 + THEN
;

\ ======================= END CUSTOMIZATION ================================

[DECIMAL]

: outenc ( bp -- )    \ output group of 3 bytes from bp
     DUP C@ 4 / enc putb
     DUP C@ 16 * 48 AND OVER 1+ C@ 16 / 15 AND OR enc putb
     1+ DUP C@ 4 * 60 AND OVER 1+ C@ 64 / 3 AND OR enc putb
     1+ C@ 63 AND enc putb

;

\   out-loop

 : out-loop  ( n -- )        \ output until n is zero
         DUP 0> IF
              0 DO inbuf I + outenc 3 +LOOP
              newline
         ELSE DROP THEN

;

\       write_head

\ expects $addr of remote file name

: write_head  ( $addr -- )
        s" begin 777 " $write
        \ write file name
        COUNT $write newline
;


\ ====== everything above here could be made private =========================

: uuencode ( $addr1 count1 -- )
      inbuf0 C!
      inbuf inbuf0 C@ CMOVE

      inbuf write_head

      BEGIN 45 read DUP 0> IF DUP enc putb THEN
              WHILE inbuf0 C@ out-loop
      REPEAT

      0 enc putb

      newline s" end" $write newline

      flushb
;

: (disk)                               ( m a n -- )
  rot                                  ( a n m)
  open error? abort" Cannot open file" \ issue message if error
  use
;

: Convert
  argn 3 <>                            \ check arguments
  abort" Usage: UUENCODE [file] [uuencoded file]"
  input  1 args (disk)                 \ open input file
  output 2 args (disk)                 \ open output file
  1 args uuencode                      \ read file
;

Convert
