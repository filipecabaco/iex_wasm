\ xchar reference implementation: UTF-8 (and ISO-LATIN-1)

\ environmental dependency: pchars are stored as bytes
\ environmental dependency: lower case words accepted

\ doesn't implement set-source-encoding and set-file-encoding

[UNDEFINED] U<     [IF] include lib/ansdbl.4th [THEN]
[UNDEFINED] HOLDS  [IF] include lib/holds.4th  [THEN]
[UNDEFINED] WITHIN [IF] include lib/range.4th  [THEN]

[UNDEFINED] XCHAR+ [IF]
-77 Constant mal-xchar

[hex]

80 Value maxascii

: xc-size ( xc -- n )
    dup      maxascii u< IF  drop 1  EXIT  THEN \ special case ASCII
    800  2 >r
    BEGIN  2dup u< 0=  WHILE  5 lshift r> 1+ >r  dup 0= UNTIL
    2drop r> ;

: xc@+ ( xcaddr -- xcaddr' u )
    DUP CHAR+ SWAP C@ dup maxascii u< IF  EXIT  THEN  \ special case ASCII
    7F and  40 >r
    BEGIN   dup r@ and  WHILE  r@ xor
	    6 lshift r> 5 lshift >r >r DUP CHAR+ SWAP C@
	    3F and r> or
    REPEAT  r> drop ;

: xc!+ ( xc xcaddr -- xcaddr' )
    over maxascii u< IF  tuck c! char+  EXIT  THEN \ special case ASCII
    >r 0 swap  3F
    BEGIN  2dup u>  WHILE
	    2/ >r  dup 3F and 80 or swap 6 rshift r>
    REPEAT  7F xor 2* or  r>
    BEGIN   over 80 u< 0= WHILE  tuck c! char+  REPEAT  nip ;

: xc!+? ( xc xcaddr u -- xcaddr' u' flag )
    >r over xc-size r@ over u< IF ( xc xc-addr1 len r: u1 )
	\ not enough space
	drop nip r> false
    ELSE
	>r xc!+ r> r> swap - true
    THEN ;

\ scan to next/previous xchar

: xchar+ ( xcaddr -- xcaddr' )  xc@+ drop ;
: xchar- ( xcaddr -- xcaddr' )
    BEGIN  1 chars - dup c@ C0 and maxascii <>  UNTIL ;

: +x/string ( xc-addr1 u1 -- xc-addr2 u2 )
    over dup xchar+ swap - /string ;
: x\string- ( xcaddr u -- xcaddr u' )
    over + xchar- over - ;

\ skip trailing garbage

: x-size ( xcaddr u1 -- u2 ) drop
    \ length of UTF-8 char starting at u8-addr (accesses only u8-addr)
    c@
    dup 80 u< IF drop 1 exit THEN
    dup c0 u< IF mal-xchar throw  THEN
    dup e0 u< IF drop 2 exit THEN
    dup f0 u< IF drop 3 exit THEN
    dup f8 u< IF drop 4 exit THEN
    dup fc u< IF drop 5 exit THEN
    dup fe u< IF drop 6 exit THEN
    mal-xchar throw ;

: -trailing-garbage ( xcaddr u1 -- xcaddr u2 )
    2dup + dup xchar- ( addr u1 end1 end2 )
    2dup dup over over - x-size + = IF \ last xchar ok
	2drop
    ELSE
	nip nip over -
    THEN ;

\ utf key and emit

: xemit ( xc -- )
    dup maxascii u< IF  emit  EXIT  THEN \ special case ASCII
    0 swap  3F
    BEGIN  2dup u>  WHILE
	    2/ >r  dup 3F and 80 or swap 6 rshift r>
    REPEAT  7F xor 2* or
    BEGIN   dup 80 u< 0= WHILE emit  REPEAT drop ;

8 string xholdbuf

: xhold ( xchar -- )   xholdbuf tuck xc!+ over - holds ;

\ utf size

\ uses wcwidth ( xc -- n )

create wc-table                        \ derived from wcwidth source code, for UCS32
  358 , 300 , 0 ,
  370 , 35D , 0 ,
  487 , 483 , 0 ,
  48A , 488 , 0 ,
  5A2 , 591 , 0 ,
  5BA , 5A3 , 0 ,
  5BE , 5BB , 0 ,
  5C0 , 5BF , 0 ,
  5C3 , 5C1 , 0 ,
  5C5 , 5C4 , 0 ,
  604 , 600 , 0 ,
  616 , 610 , 0 ,
  659 , 64B , 0 ,
  671 , 670 , 0 ,
  6E5 , 6D6 , 0 ,
  6E9 , 6E7 , 0 ,
  6EE , 6EA , 0 ,
  710 , 70F , 0 ,
  712 , 711 , 0 ,
  74B , 730 , 0 ,
  7B1 , 7A6 , 0 ,
  903 , 901 , 0 ,
  93D , 93C , 0 ,
  949 , 941 , 0 ,
  94E , 94D , 0 ,
  955 , 951 , 0 ,
  964 , 962 , 0 ,
  982 , 981 , 0 ,
  9BD , 9BC , 0 ,
  9C5 , 9C1 , 0 ,
  9CE , 9CD , 0 ,
  9E4 , 9E2 , 0 ,
  A03 , A01 , 0 ,
  A3D , A3C , 0 ,
  A43 , A41 , 0 ,
  A49 , A47 , 0 ,
  A4E , A4B , 0 ,
  A72 , A70 , 0 ,
  A83 , A81 , 0 ,
  ABD , ABC , 0 ,
  AC6 , AC1 , 0 ,
  AC9 , AC7 , 0 ,
  ACE , ACD , 0 ,
  AE4 , AE2 , 0 ,
  B02 , B01 , 0 ,
  B3D , B3C , 0 ,
  B40 , B3F , 0 ,
  B44 , B41 , 0 ,
  B4E , B4D , 0 ,
  B57 , B56 , 0 ,
  B83 , B82 , 0 ,
  BC1 , BC0 , 0 ,
  BCE , BCD , 0 ,
  C41 , C3E , 0 ,
  C49 , C46 , 0 ,
  C4E , C4A , 0 ,
  C57 , C55 , 0 ,
  CBD , CBC , 0 ,
  CC0 , CBF , 0 ,
  CC7 , CC6 , 0 ,
  CCE , CCC , 0 ,
  D44 , D41 , 0 ,
  D4E , D4D , 0 ,
  DCB , DCA , 0 ,
  DD5 , DD2 , 0 ,
  DD7 , DD6 , 0 ,
  E32 , E31 , 0 ,
  E3B , E34 , 0 ,
  E4F , E47 , 0 ,
  EB2 , EB1 , 0 ,
  EBA , EB4 , 0 ,
  EBD , EBB , 0 ,
  ECE , EC8 , 0 ,
  F1A , F18 , 0 ,
  F36 , F35 , 0 ,
  F38 , F37 , 0 ,
  F3A , F39 , 0 ,
  F7F , F71 , 0 ,
  F85 , F80 , 0 ,
  F88 , F86 , 0 ,
  F98 , F90 , 0 ,
  FBD , F99 , 0 ,
  FC7 , FC6 , 0 ,
  1031 , 102D , 0 ,
  1033 , 1032 , 0 ,
  1038 , 1036 , 0 ,
  103A , 1039 , 0 ,
  105A , 1058 , 0 ,
  1101 , 0 , 1 ,
  1160 , 1100 , 2 ,
  1200 , 1160 , 0 ,
  1715 , 1712 , 0 ,
  1735 , 1732 , 0 ,
  1754 , 1752 , 0 ,
  1774 , 1772 , 0 ,
  17B6 , 17B4 , 0 ,
  17BE , 17B7 , 0 ,
  17C7 , 17C6 , 0 ,
  17D4 , 17C9 , 0 ,
  17DE , 17DD , 0 ,
  180E , 180B , 0 ,
  18AA , 18A9 , 0 ,
  1923 , 1920 , 0 ,
  1929 , 1927 , 0 ,
  1933 , 1932 , 0 ,
  193C , 1939 , 0 ,
  2010 , 200B , 0 ,
  202F , 202A , 0 ,
  2064 , 2060 , 0 ,
  2070 , 206A , 0 ,
  20EB , 20D0 , 0 ,
  232B , 2329 , 2 ,
  3030 , 302A , 0 ,
  303F , 2E80 , 2 ,
  309B , 3099 , 0 ,
  A4D0 , 3040 , 2 ,
  D7A4 , AC00 , 2 ,
  FB00 , F900 , 2 ,
  FB1F , FB1E , 0 ,
  FE10 , FE00 , 0 ,
  FE24 , FE20 , 0 ,
  FE70 , FE30 , 2 ,
  FF00 , FEFF , 0 ,
  FF61 , FF00 , 2 ,
  FFE7 , FFE0 , 2 ,
  FFFC , FFF9 , 0 ,
  1D16A , 1D167 , 0 ,
  1D183 , 1D173 , 0 ,
  1D18C , 1D185 , 0 ,
  1D1AE , 1D1AA , 0 ,
  2FFFE , 20000 , 2 ,
  3FFFE , 30000 , 2 ,
  E0002 , E0001 , 0 ,
  E0080 , E0020 , 0 ,
  E01F0 , E0100 , 0 ,
here wc-table - Constant #wc-table

\ inefficient table walk:

: xc-width ( xchar -- n )
    wc-table #wc-table over + swap ?DO
        dup I dup cell+ @c swap @c within
       IF  drop I 2 cells + @c  UNLOOP EXIT  THEN
    3 cells +LOOP  drop 1 ;

: x-width ( xcaddr u -- n )
    0 rot rot over + swap ?DO
	I xc@+ swap >r xc-width +
    r> I - +LOOP ;

\ switching encoding is only recommended at startup
\ only two encodings are supported: UTF-8 and ISO-LATIN-1

80 Constant utf-8
100 Constant iso-latin-1

: set-internal-encoding to maxascii ;
aka maxascii get-internal-encoding

[DEFINED] 4TH# [IF]
  hide mal-xchar
  hide maxascii
  hide xholdbuf
  hide wc-table
  hide #wc-table
[THEN]

[decimal]
[THEN]