\ Convert a blockfile to an indexed HTML file

\ Usage:  BLK2HTML filename.scr
\ Output: filename.html

[DEFINED] 4TH# [IF]
include lib/ansfile.4th
include lib/pickroll.4th

64 string BUF                          \ line input buffer
512 string (OUT)                       \ line output buffer

: GetFilename 1 ARGS ;
[THEN]

[UNDEFINED] 4TH# [IF]
CREATE BUF 64 CHARS ALLOT              \ line input buffer
CREATE (OUT) 512 CHARS ALLOT           \ line output buffer

: GetFilename BL PARSE ;
[THEN]


\ file-id's
VARIABLE SRC
VARIABLE DST
VARIABLE >OUT

: RESET  0 >OUT ! ;

: +OUT ( a # -  Append a string to OUT)
  >OUT @  OVER >OUT +!  (OUT) +  SWAP CMOVE ;
: chOUT ( c -  Append a char to OUT)
  (OUT) >OUT @ + C!  1 >OUT +! ;
: #OUT ( n -  Append a number to OUT)
  S>D <# #s #> +OUT ;

: PROCESS+OUT ( a # -  Append to OUT, escaping HTML tags)
  0 do DUP C@
    DUP [char] < = IF  DROP S" &lt;" +OUT ELSE
    DUP [char] > = IF  DROP S" &gt;" +OUT ELSE
    DUP [char] & = IF  DROP S" &amp;" +OUT ELSE
    chOUT  THEN THEN THEN
  1+ loop DROP ;

: WRITE-OUT
  (OUT) >OUT @ DST @ WRITE-LINE RESET ABORT" Write error" ;


: BASENAME ( a1 u1 - a2 u2  Remove extension)
  SWAP OVER ( u a u)
  BEGIN 1- 2DUP + C@ [CHAR] . =  OVER 0=  OR UNTIL
  ?DUP IF  ROT DROP  ELSE  SWAP  THEN ;

: ADD-TXT ( a u - a2 u2  Add .txt extension)
  BASENAME  SWAP OVER PAD SWAP CMOVE ( u) >R
  S" .html" SWAP OVER ( u a u) PAD R@ + SWAP CMOVE
  R> + PAD SWAP ;


: BLK>HTML ( "blockfile" -)  GetFilename 2DUP
  R/O BIN OPEN-FILE ABORT" Can't open input file" SRC !
  ADD-TXT  ." Saving as: " 2DUP TYPE CR
  W/O CREATE-FILE ABORT" Can't create output file" DST !

  \ Index of Blocks
  S" <DL>" +OUT WRITE-OUT
  -1 BEGIN 1+ DUP >R
    BUF 64 SRC @ READ-FILE ABORT" Read error"
    DUP  0<> BUF C@ [char] ( = AND  IF
      R@ 15 AND 0= IF
        S" <DT><A HREF=" +OUT
        R@ 4 RSHIFT DUP 1+
        [char] " chOUT  [char] # chOUT  #OUT  [char] " chOUT
        S" >" +OUT  [char] # chOUT  #OUT  S" </A><DD>" +OUT
        BUF 64 -TRAILING  PROCESS+OUT
        WRITE-OUT  THEN
      THEN R> DROP
  0= UNTIL  DROP
  S" </DL>" +OUT WRITE-OUT

  0 S>D SRC @ REPOSITION-FILE  \ rewind

  \ Full Blocks
  S" <pre>" +OUT WRITE-OUT  \ dummy <PRE>
  -1 BEGIN
    1+ DUP >R
    BUF 64 SRC @ READ-FILE ABORT" Read error"
    R@ 15 AND 0= IF
      R@ 4 RSHIFT DUP 1+
      S" </pre><hr><A NAME=" +OUT
      [char] " chOUT  #OUT  [char] " chOUT
      S" ></A><h2>" +OUT  [char] # chOUT  #OUT   S" </h2><pre>" +OUT
      WRITE-OUT
    THEN R> DROP
    DUP  IF
      BUF 64 -TRAILING
      ?DUP if PROCESS+OUT else DROP then
      WRITE-OUT
    THEN
  0= UNTIL  DROP
  S" </pre><hr>" +OUT WRITE-OUT

  SRC @ CLOSE-FILE  DST @ CLOSE-FILE  2DROP ;

[DEFINED] 4TH# [IF]
  argn 2 < abort" Usage: blk2html filename.scr" blk>html
[THEN]
