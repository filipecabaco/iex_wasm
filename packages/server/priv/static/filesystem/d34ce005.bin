\  *******************************************************************
\  *                                                                 *
\  *     LZ77 Data Compression                                       *
\  *                                                                 *
\  *******************************************************************

\  Programmers are lousy lovers.  They always try to get the job done
\  faster than before.  And when they do, they brag that they have
\  better performance.  Programmers are the only men who boast how
\  small theirs is.

\  Since 1984 there has been amazing progress in data compression.

\  In the early 90's I got SALIENT SOFTWARE's AutoDoubler for the
\  Macintosh. My 80 megabyte hard drive had 2 meg available when I
\  installed the program. Since it was a Tuesday, I went out for lasagna,
\  and when I got back an hour later I had 19 meg available.

\  My 80 meg hard drive soon held 108 megs worth of data with
\  room for 25 to 50 more megabytes.

\  Not only that, but many programs loaded faster and read data
\  faster. When a file takes only half as much disk space, the data can
\  be read twice as fast.

\  How they do it is a trade secret, and Salient has applied for a
\  patent on their technology. There are also many variations possible
\  concerning details.

\  However, I have a good idea about where to begin looking.

\  Modern methods of data compression all go back to J. ZIV and A.
\  LEMPEL. In 1977 they published a paper in an engineering journal on
\  a new approach to data compresson.

\    J. ZIV and A. LEMPEL, "A Universal Algorithm for Sequential Data
\    Compression," IEEE Transactions on Information Theory, 23:3, 337-343.

\  In 1978 they published a paper about a related and more
\  elaborate method. In 1984 Unisys employee TERRY WELCH described
\  and had patented a version of the 1978 method suitable for
\  programming. This is called LZW for Lempel, Ziv, and Welch.

\  LZW is the basis of ARC and PKARC on the PC, compress in Unix, and
\  the original StuffIt on the Mac.

\  Around 1988 after losing a law suit PHIL KATZ (PKARC) came out with a
\  better program, PKZIP. This is derived from the 1977 Ziv-Lempel paper.
\  It turns out that the simpler method has better performance and is
\  smaller. With additional processing, phenomonal results have been
\  obtained.

\  All popular archivers - arj, lha, zip, zoo, stac, auto-doubler,
\  current stuffit - are variations on the LZ77 theme.

\  The idea of LZ77 is very simple. It is explained in the FAQ
\  (frequently asked question) list for compression technology:

\            The LZ77 family of compressors

\    LZ77-based schemes keep track of the last n bytes of data seen, and
\    when a phrase is encountered that has already been seen, they output a
\    pair of values corresponding to the position of the phrase in the
\    previously-seen buffer of data, and the length of the phrase.

\    In effect the compressor moves a fixed-size "window" over the data
\    (generally referred to as a "sliding window" [or "ring buffer"], with
\    the position part of the (position, length) pair referring to the
\    position of the phrase within the window.

\    The most commonly used algorithms are derived from the LZSS scheme
\    described by JAMES STORER and THOMAS SZYMANSKI in 1982. In this the
\    compressor maintains a window of size N bytes and a "lookahead buffer"
\    the contents of which it tries to find a match for in the window:

\        while( lookAheadBuffer not empty )
\            {
\            get pointer ( position, match ) to the longest match in the window
\                for the lookahead buffer;

\            if( length > MINIMUM_MATCH_LENGTH )
\                {
\                output a ( position, length ) pair;
\                shift the window length characters along;
\                }
\            else
\                {
\                output the first character in the lookahead buffer;
\                shift the window 1 character along;
\                }
\            }

\    Decompression is simple and fast: Whenever a ( position, length ) pair
\    is encountered, go to that ( position ) in the window and copy ( length
\    ) bytes to the output.

\    Sliding-window-based schemes can be simplified by numbering the input
\    text characters mod N, in effect creating a circular buffer. The
\    sliding window approach automatically creates the LRU effect which must
\    be done explicitly in LZ78 schemes.

\    Variants of this method apply additional compression to the output of
\    the LZSS compressor, which include a simple variable-length code (LZB),
\    dynamic Huffman coding (LZH), and Shannon-Fano coding (ZIP 1.x)), all
\    of which result in a certain degree of improvement over the basic
\    scheme, especially when the data are rather random and the LZSS
\    compressor has little effect.

\  A copy of this FAQ is available by ftp from rtfm.mit.edu in
\  /pub/usenet/news.answers as compression-faq/part[1-3]. The profane
\  pseudocode given for LZ77 compression can be Forthed as:

\      BEGIN
\          look-ahead-buffer-used 0= not
\      WHILE
\          get-pointer(position,match)-to-longest-match
\          length minimum-match-length > IF
\              output-a-(position,match)-pair
\              shift-the-window-length-characters-along
\          ELSE
\              output-first-character-in-lookahead-buffer
\              shift-the-window-1-character-along
\          THEN
\      REPEAT

\  The bottleneck is the finding the longest match quickly. A na•ve brute
\  force method is hardly acceptable. "It's hardly acceptable" is a
\  gentilism for "it sucks". Hashing, or binary search trees, or a
\  combination, is recommended.

\   * Waterworth patented (4,701,745) the algorithm now known as LZRW1,
\     because Ross Williams reinvented it later and posted it on
\     comp.compression on April 22, 1991. The same algorithm has later
\     been patented by Gibson & Graybill. The patent office failed to
\     recognize that the same algorithm was patented twice, even though
\     the wording used in the two patents is very similar.

\     The Waterworth patent is now owned by Stac Inc, which won a lawsuit
\     against Microsoft, concerning the compression feature of MSDOS 6.0.
\     Damages awarded were $120 million.

\   * Fiala and Greene obtained in 1990 a patent (4,906,991) on all
\     implementations of LZ77 using a tree data structure.

\   * Notenboom (from Microsoft) 4,955,066 uses three levels of
\     compression, starting with run length encoding.

\   * The Gibson & Graybill patent 5,049,881 covers the LZRW1 algorithm
\     previously patented by Waterworth and reinvented by Ross Williams.
\     Claims 4 and 12 are very general and could be interpreted as
\     applying to any LZ algorithm using hashing (including all variants
\     of LZ78):

\   * Phil Katz, author of pkzip, also has a patent on LZ77 (5,051,745)
\     but the claims only apply to sorted hash tables, and when the hash
\     table is substantially smaller than the window size.

\   * IBM patented (5,001,478) the idea of combining a history buffer
\     (the LZ77 technique) and a lexicon (as in LZ78).

\   * Stac Inc patented (5,016,009 and 5,126,739) yet another variation
\     of LZ77 with hashing. The '009 patent was used in the lawsuit
\     against Microsoft (see above). Stac also has patents on LZ77 with
\     parallel lookup in hardware (4,841,092 and 5,003,307).

\   * Chambers 5,155,484 is yet another variation of LZ77 with hashing.
\     The hash function is just the juxtaposition of two input bytes.
\     This is the "invention" being patented. The hash table is named
\     "direct lookup table". [Chambers is the author of AutoDoubler and
\     DiskDoubler.]

\  A simple implementation of LZSS using binary search trees giving
\  very good but not best performance was put into the public domain
\  in 1988 by HARUHIKO OKUMURA. This implementation has inspired the
\  high performance programs now in use.

\  Given here is a Standard Forth version of that program. It shows
\  its genealogy by the unusually long Forth definitions. I believe that
\  politically correct factoring would not help understanding and would
\  degrade performance. This program is 8 to 10 times faster than the
\  brute force implementation I gave at the 1992 FORML Conference. It
\  can serve as material for studying data compression in Forth, as the
\  original program did in C and Pascal.

\  As an example, here is the beginning of _Green Eggs and Ham_,
\  copyright 1960, DR. SEUSS.

\      That Sam-I-am!
\      That Sam-I-am!
\      I do not like that Sam-I-am!

\      Do you like green eggs and ham?

\      I do not like them, Sam-I-am.
\      I do not like green eggs and ham.

\  Compressed with LZSS this becomes:

\      |That Sam|-I-am!
\      []|I do not| like t[]|
\      Do you[]|green eg|gs and h|am?
\      []em,|[].[][].

\  "|" represents a format byte. "[]" represents a two-byte position
\  and length.

[UNDEFINED] compress [IF]
\  *******************************************************************
\  *     General Utilities                                           *
\  *******************************************************************

\  You may already have some of these.

1 string read-char does> dup 1 accept if c@ else drop -1 then ;

\  *******************************************************************
\  *     Application Data                                            *
\  *******************************************************************

\      LZSS -- A Data Compression Program
\      1989-04-06 Standard C by Haruhiko Okumura
\      1994-12-09 Standard Forth by Wil Baden
\      2001-O9-15 Minor changes and reformatting by Wil Baden
\      2002-07-21 Eliminate `PICK`
\      2012-08-18 4tH version by Hans Bezemer

\      Use, distribute, and modify this program freely.  [Haruhiko Okumura]

\      [Comments by Haruhiko Okumura]

4096  CONSTANT    N     \  Size of Ring Buffer
18    CONSTANT    F     \  Upper Limit for match-length
2     CONSTANT    THRESHOLD  \  Encode string into position & length
                        \  when match-length is greater.
N     CONSTANT    NIL   \  Index for Binary Search Tree Root

VARIABLE    TEXTSIZE    \  Text Size Counter
VARIABLE    CODESIZE    \  Code Size Counter

\  These are set by Insert-Node procedure.

VARIABLE    Match-Position
VARIABLE    Match-Length

N  F 1- +  2 +  BUFFER: Text-Buf   \  Ring buffer of size N, with extra
                            \  F-1 bytes to facilitate string comparison.

\  Left & Right Children and Parents -- Binary Search Trees

N 1+        array lson
N 257 +     array rson
N 1+        array dad

\  For i = 0 to N - 1, RSon[i] and LSon[i] will be the right and
\  left children of node i.  These nodes need not be initialized.
\  Also, DAD[i] is the parent of node i.  These are initialized to
\  NIL = N, which stands for "not used".
\  For i = 0 to 255, RSon[N + i + 1] is the root of the tree
\  for strings that begin with character i.  These are initialized
\  to NIL.  Note there are 256 trees.

\  *******************************************************************
\  *     Initialize trees.                                           *
\  *******************************************************************

: Init-Trees                                ( -- )
      N 257 +  N 1+  DO  NIL  I cells RSON + !  LOOP
      N  0  DO  NIL  I cells DAD + !  LOOP
      0 TEXTSIZE !  0 CODESIZE ! ;

\  *******************************************************************
\  *     Insert-Node                                                 *
\  *******************************************************************

\  Insert-Node
\     Insert string of length F, Text-Buf[r..r+F-1], into one of the
\     trees of Text-Buf[r]nth tree and return the longest-match position
\     and length via the global variables Match-Position and
\     Match-Length.  If Match-Length = F, then remove the old node in
\     favor of the new one, because the old one will be deleted sooner.
\     Note r plays double role, as tree node and position in buffer.

: Insert-Node                              ( r -- )
      NIL over cells LSON + !    NIL over cells RSON + !    0 Match-Length !
      dup Text-Buf + C@  N +  1+                ( r p)
      1                                         ( r p cmp)
      BEGIN                                     ( r p cmp)
            0< IF                               ( r p)
                  dup cells LSON + @ NIL = IF
                        2dup cells LSON + !
                        SWAP cells DAD + !      ( --)
                        EXIT 
                  ELSE
                        cells LSON + @
                  THEN
            ELSE                                ( r p)
                  dup cells RSON + @ NIL = IF
                        2dup cells RSON + !
                        SWAP cells DAD + !      ( --)
                        EXIT 
                  ELSE
                        cells RSON + @
                  THEN
            THEN                                ( r p)
            0 F dup 1 DO                        ( r p . .)
                  >r >r over r> r> rot I + Text-Buf + C@      ( r p . .  c)
                  >r >r over r> r> rot I + Text-Buf + C@ -    ( r p . . cmp)
                  DUP IF  NIP NIP  I  LEAVE ELSE DROP THEN  ( r p . .)
            LOOP                                ( r p cmp i)
            dup Match-Length @ > IF
                  >r over r> swap Match-Position !
                  dup Match-Length !
                  F < 0=
            ELSE
                  DROP FALSE
            THEN                                ( r p cmp flag)
      UNTIL                                     ( r p cmp)
      DROP                                      ( r p)
      2dup cells DAD + @ SWAP cells DAD + !
      2dup cells LSON + @ SWAP cells LSON + !
      2dup cells RSON + @ SWAP cells RSON + !
      2dup cells LSON + @ cells DAD + !
      2dup cells RSON + @ cells DAD + !
      dup cells DAD + @ cells RSON + @ over = IF
            TUCK cells DAD + @ cells RSON + !
      ELSE
            TUCK cells DAD + @ cells LSON + !
      THEN                                      ( p)
      cells DAD + NIL SWAP !    \  Remove p       ( --)
      ;

\  *******************************************************************
\  *     Delete-Node                                                 *
\  *******************************************************************

\  Delete-Node
\     Delete node p from tree.

: Delete-Node                                   ( p -- )
      dup cells DAD + @ NIL = IF  DROP  EXIT THEN   \  Not in tree.
      dup cells RSON + @ NIL = IF
            dup cells LSON + @
      ELSE
      dup cells LSON + @ NIL = IF
            dup cells RSON + @
      ELSE
            dup cells LSON + @                    ( p q)
            dup cells RSON + @ NIL <> IF
                  BEGIN
                        cells RSON + @
                        dup cells RSON + @ NIL =
                  UNTIL
                  dup cells LSON + @ over cells DAD + @ cells RSON + !
                  dup cells DAD + @ over cells LSON + @ cells DAD + !
                  over cells LSON + @ over cells LSON + !
                  over cells LSON + @ cells DAD + over SWAP !
            THEN
            over cells RSON + @ over cells RSON + !
            over cells RSON + @ cells DAD + over SWAP !
      THEN THEN                                 ( p q)
      over cells DAD + @ over cells DAD + !
      over dup cells DAD + @ cells RSON + @ = IF
            over cells DAD + @ cells RSON + !
      ELSE
            over cells DAD + @ cells LSON + !
      THEN                                      ( p)
      cells DAD + NIL SWAP ! ;                    ( --)


\  *******************************************************************
\  *     Statistics                                                  *
\  *******************************************************************

: Statistics                              ( -- )
      ." In : " textsize @ . CR
      ." Out: " codesize @ . CR
      textsize @ IF
            ." Saved: " textsize @ codesize @ - 100 textsize @ */
                  2 .R ." %" CR
      THEN
\      infile closed    outfile closed
;

\  *******************************************************************
\  *     Compress                                                    *
\  *******************************************************************

      17 2 + BUFFER:  Code-Buf

      VARIABLE    LEN
      VARIABLE    Last-Match-Length
      VARIABLE    Code-Buf-PTR

      1 STRING    MASK

: Compress                                      ( -- )
      Init-Trees    \  Initialize trees.

      \  Code-Buf[1..16] holds eight units of code, and Code-Buf[0]
      \  works as eight flags, "1" representing that the unit is an
      \  unencoded letter in 1 byte, "0" a position-and-length pair
      \  in 2 bytes.  Thus, eight units require at most 16 bytes
      \  of code.

      0 Code-Buf C!
      1 MASK C!   1 Code-Buf-PTR !
      0    N F -                                ( s r)

      \  Clear the buffer with a character that will appear often.
      Text-Buf N F -   BL  FILL


      \  Read F bytes into the last F bytes of the buffer.
      dup Text-Buf + F ACCEPT                   ( s r count)
      dup LEN !  dup TEXTSIZE !
      0= IF  2DROP  EXIT THEN                   ( s r)

      \  Insert the F strings, each of which begins with one or more
      \  "space" characters.  Note the order in which these strings
      \  are inserted.  This way, degenerate trees will be less
      \  likely to occur.

      F  1+ 1 DO  dup I - Insert-Node  LOOP

      \  Finally, insert the whole string just read.  The global
      \  variables Match-Length and Match-Position are set.
      dup ( r) Insert-Node

      BEGIN                                     ( s r)
            \  Match-Length may be spuriously long at end of text.
            Match-Length @ LEN @ > IF  LEN @ Match-Length !  THEN

            Match-Length @ THRESHOLD > IF
                  \  Send position and length pair.
                  \  Note Match-Length > THRESHOLD.
                  Match-Position @  Code-Buf-PTR @ Code-Buf + C!
                  1 Code-Buf-PTR +!
                  Match-Position @  8 RSHIFT  4 LSHIFT ( . . j)
                        Match-Length @  THRESHOLD -  1-  OR
                        Code-Buf-PTR @  Code-Buf + C!  ( . .)
                  1 Code-Buf-PTR +!
            ELSE
                  \  Not long enough match.  Send one byte.
                  1 Match-Length !
                  \  "send one byte" flag
                  MASK C@ Code-Buf C@ OR Code-Buf C!
                  \  Send uncoded.
                  dup Text-Buf + C@ Code-Buf-PTR @ Code-Buf + C!
                  1 Code-Buf-PTR +!
            THEN
            \  Shift mask left one bit. )        ( . .)
            MASK C@  2*  MASK C!  MASK C@ 0= IF
                  \  Send at most 8 units of code together.
                  Code-Buf  Code-Buf-PTR @    ( . . a k)
                        TYPE ( . .)
                  Code-Buf-PTR @  CODESIZE  +!
                  0 Code-Buf C!    1 Code-Buf-PTR !    1 MASK C!
            THEN                                ( s r)
            Match-Length @ Last-Match-Length !
            Last-Match-Length @ dup 0 DO        ( s r n)
                  Read-Char                     ( s r n c)
                  dup 0< IF  2DROP I LEAVE
                  ELSE
                     \  Delete old strings and read new bytes.
                     >r >r over r> r> rot ( s) Delete-Node
                     >r >r over r> swap r> dup rot ( c s) Text-Buf + C!
                     \  If the position is near end of buffer, extend
                     \  the buffer to make string comparison easier.
                     >r >r over r> r> rot  ( s) F 1- < IF         ( s r n c)
                        >r >r over r> swap r> dup rot ( c s) N + Text-Buf + C!
                    THEN
                    DROP                          ( s r n)
                    \  Since this is a ring buffer, increment the
                    \  position modulo N.
                    >R >R                         ( s)
                        1+  N 1- AND
                    R>                            ( s r)
                        1+  N 1- AND
                    R>                            ( s r n)
                    \  Register the string in Text-Buf[r..r+F-1].
                    over Insert-Node
                  THEN
            LOOP                                ( s r i)
            dup TEXTSIZE +!

            \  After the end of text, no need to read, but
            \  buffer might not be empty.
            Last-Match-Length @ SWAP ( s r l i) ?DO  ( s r)
                  over Delete-Node
                  >R  ( s) 1+  N 1- AND  R>
                  ( r) 1+  N 1- AND
                  -1 LEN +!  LEN @ IF
                        dup Insert-Node
                  THEN
            LOOP

            LEN @ 0> 0=
      UNTIL  2DROP                              ( --)

      \  Send remaining code.
      Code-Buf-PTR @ 1 > IF
            Code-Buf  Code-Buf-PTR @  TYPE
            Code-Buf-PTR @ CODESIZE +!
      THEN
;

\  *******************************************************************
\  *     Decompress                                                    *
\  *******************************************************************

\  Just the reverse of Compress.

: Decompress                                     ( -- )
      \  [Warning: Does not close In-File or Out-File.]
      Text-Buf  N F -   BL FILL
      0  N F -                                  ( flags r)
      BEGIN
            >R                                  ( flags)
                  1 RSHIFT dup 256 AND 0= IF DROP     ( --)
                        Read-Char               ( c)
                        dup 0< IF  R> 2DROP  EXIT THEN
                        [HEX] 0FF00 [DECIMAL] OR ( flags)
                        \  Uses higher byte to count eight.
                  THEN
            R>                                  ( flags r)
            over 1 AND IF
                  Read-Char                     ( . r c)
                  dup 0< IF  DROP 2DROP  EXIT THEN
                  over Text-Buf + C!            ( . r)
                  dup Text-Buf + 1 TYPE
                  1+  N 1- AND
            ELSE
                  Read-Char                     ( . r i)
                  dup 0< IF  DROP 2DROP  EXIT THEN
                  Read-Char                     ( . . i j)
                  dup 0< IF  2DROP 2DROP  EXIT THEN
                  dup >R  4 RSHIFT  8 LSHIFT OR  R>
                  15 AND  THRESHOLD +  1+
                  0 ?DO                         ( . r i)
                        dup I +  N 1- AND  Text-Buf +       ( . r i addr)
                        dup 1 TYPE
                        C@  >r over r> swap ( c r) Text-Buf + C!  ( . r i)
                        >R  ( r) 1+  N 1- AND  R>
                  LOOP                          ( . r i)
                  DROP                          ( flags r)
            THEN
      AGAIN ;

[DEFINED] 4TH# [IF]
  hide read-char
  hide N
  hide F
  hide THRESHOLD
  hide NIL
  hide TEXTSIZE
  hide CODESIZE
  hide Match-Position
  hide Match-Length
  hide Text-Buf
  hide lson
  hide rson
  hide dad
  hide Init-Trees
  hide Insert-Node
  hide Delete-Node
  hide Code-Buf
  hide LEN
  hide Last-Match-Length
  hide Code-Buf-PTR
  hide Mask
[THEN]
[THEN]

\  End of LZ77

\ s" test.fods" input open dup use
\ s" test.lz" output open dup use compress close close Statistics

\ s" test.lz" input open dup use
\ s" test1.fods" output open dup use decompress close close depth .
