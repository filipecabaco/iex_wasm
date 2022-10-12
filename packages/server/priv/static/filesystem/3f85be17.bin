\ 4tH library - RTF generation - Copyright 2016 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Some RTF code sequences are derived from LaTeX2RTF, http://latex2rtf.sourceforge.net

[UNDEFINED] begins [IF]                \ incompatible with html.4th or latex.4th
[UNDEFINED] break? [IF] include lib/breakq.4th  [THEN]

8 constant (#section)                  \ maximum depth of sections
(#section) array (sections)            \ array for generating section numbers

0 value (document)                     \ article or book?

variable (item#)                       \ variable for enumeration numbers
variable (table#)                      \ variable for table caption numbers
variable (current)                     \ points to current section depth

7 1440 * constant (twips)              \ size of writable area in twips
s" {" sconstant (brace)                \ string of brace character

aka (brace) %enumerate                 \ start enumeration with brace
aka (brace) %description               \ start description with brace
aka (brace) %tablefloat                \ start tablefloat with brace
aka (brace) %itemize                   \ start items list with brace
                                       \ formatting styles
s" {\pard\plain\s0\qj\widctlpar\f0\fs20\sl240\slmult1 \sb120 \li512\ri512\fi300"  sconstant %quote
s" {\pard\plain\s0\qj\widctlpar\f0\fs20\sl240\slmult0 \sb60 \li1134\fi0"          sconstant %verse
s" {\pard\plain\s38\ql\widctlpar\f3\fs16\sl240\slmult1 \sb60 \fi0"                sconstant %listing
s" {\pard\plain\s32\qc\sb120\sa0\keep\widctlpar\f0\fs20\sl240\slmult1 \sb50 \fi0" sconstant %table
s" {\pard\plain\s9\qc\sb120\sa120\keep\widctlpar\f0\sl240\slmult1 \sb60 \fi0"     sconstant %center
s" {\pard\plain\s10\ql\sb120\sa120\keep\widctlpar\f0\sl240\slmult1 \fi0"          sconstant %left
s" {\pard\plain\s8\qr\sb120\sa120\keep\widctlpar\f0\sl240\slmult1 \fi0"           sconstant %right
                                       \ section styles
s" \pard\plain\s0\qj\widctlpar\f0\fs20\sl240\slmult1 \sb60 \fi0"             sconstant (paragraph)
s" \pard\plain\s0\qj\widctlpar\f0\fs20\sl240\slmult1 \sb60 \fi300 {}\par"    sconstant (ChapA)
s" \pard\plain\ql\sb240\sa120\keepn\f0\b\fs40\sl240\slmult1 \fi0 Chapter "   sconstant (ChapB)
s" \pard\plain\s2\ql\sb240\sa120\keepn\f0\b\fs40\sl240\slmult1 \sb240 \fi0 " sconstant (ChapC)
s" \pard\plain\s3\ql\sb240\sa120\keepn\f0\b\fs32\sl240\slmult1 \sb360 \fi0 " sconstant (Head2)
s" \pard\plain\s4\ql\sb240\sa120\keepn\f0\b\fs32\sl240\slmult1 \sb120 \fi0 " sconstant (Head3)
s" \pard\plain\s5\ql\sb240\sa120\keepn\f0\b\fs24\sl240\slmult1 \sb120 \fi0 " sconstant (Head4)
s" \pard\plain\s6\ql\sb240\sa120\keepn\f0\b\fs24\sl240\slmult1 \sb120 \fi0 " sconstant (Head5)
s" \pard\plain\s7\ql\sb240\sa120\keepn\f0\b\fs24\sl240\slmult1 \sb120 \fi0 " sconstant (Head6)
                                       \ other styles
s" \bullet\tab" sconstant (bullet)
s" \clbrdrl\brdrs\clbrdrt\brdrs\clbrdrb\brdrs\clbrdrr\brdrs\cellx" sconstant (rowheader)
s" {\pard\intbl\ql {" sconstant (cell
s" }\cell}" sconstant cell)
s| {\f3 \field{\*\fldinst{ HYPERLINK "| sconstant (link
s| " }{{}}}{\fldrslt{| sconstant link)
s" \pard\plain\s20\qc\sb240\sa240\b\f0\fs36\sl240\slmult1 \fi0" sconstant (title)
s" \pard\plain\s21\qc\sa120\f0\fs20\sl240\slmult1 \fi300" sconstant (author)
s" \pard\plain\s46\ql\fi-283\li283\lin283\sb0\sa120\widctlpar\tql\tx283\f0\fs20\sl240\slmult1 \sb50 \li600\fi-300"
   sconstant (description)
s" \pard\plain\s30\qc\sb120\sa120\keep\widctlpar\f0\fs16\sl240\slmult1 \fi0 {Table " sconstant (caption)
s" {\pard\brdrb\brdrs\brdrw10\brsp20\par}{\pard\par}" sconstant (line)
                                       \ start RTF section
: %beginRTF                            ( --)
  (sections) dup (#section) bounds ?do 0 i ! loop (current) ! 1 (table#) !
  ." {\rtf1\ansi\uc1\deff0" cr         \ initialize variables and array
  ." {\fonttbl" cr
  ." {\f0\fnil\fcharset0 Times New Roman;}" cr
  ." {\f3\fnil\fcharset0 Courier New;}" cr
  ." }" cr
  ." {\stylesheet" cr
  ." {\s0\qj\widctlpar\f0\fs20 \snext0 Normal;}" cr
  ." {\s2\ql\sb240\sa120\keepn\f0\b\fs40 \sbasedon0\snext0 heading 1;}" cr
  ." {\s3\ql\sb240\sa120\keepn\f0\b\fs32 \sbasedon0\snext0 heading 2;}" cr
  ." {\s4\ql\sb240\sa120\keepn\f0\b\fs32 \sbasedon0\snext0 heading 3;}" cr
  ." {\s5\ql\sb240\sa120\keepn\f0\b\fs24 \sbasedon0\snext0 heading 4;}" cr
  ." {\s6\ql\sb240\sa120\keepn\f0\b\fs24 \sbasedon0\snext0 heading 5;}" cr
  ." {\s7\ql\sb240\sa120\keepn\f0\b\fs24 \sbasedon0\snext0 heading 6;}" cr
  ." {\s8\qr\sb120\sa120\keep\widctlpar\f0 \sbasedon0\snext8 rightpar;}" cr
  ." {\s9\qc\sb120\sa120\keep\widctlpar\f0 \sbasedon0\snext9 centerpar;}" cr
  ." {\s10\ql\sb120\sa120\keep\widctlpar\f0 \sbasedon0\snext10 leftpar;}" cr
  ." {\s20\qc\sb240\sa240\b\f0\fs36 \sbasedon0\snext21 Title;}" cr
  ." {\s21\qc\sa120\f0\fs20 \sbasedon0\snext0 author;}" cr
  ." {\s30\qc\sb120\sa120\keep\widctlpar\f0\fs16 \sbasedon0\snext0 caption;}" cr
  ." {\s32\qc\sb120\sa0\keep\widctlpar\f0\fs20 \sbasedon0\snext32 Table;}" cr
  ." {\s35\qj\li1024\ri1024\fi340\widctlpar\f0\fs20 \sbasedon0\snext35 Quote;}" cr
  ." {\s38\ql\widctlpar\f3\fs16 \snext38 verbatim;}" cr
  ." {\s46\ql\fi-283\li283\lin283\sb0\sa120\widctlpar\tql\tx283\f0\fs20 \sbasedon0\snext46 List;}" cr
  ." }" cr
  ." {\footer\pard\plain\f0\fs20\qc\chpgn\par}" cr
  ." \paperw12280\paperh15900\margl1080\margr1080\margt2540\margb1760\pgnstart0\widowctrl\qj\ftnbj\f0\aftnnar" cr
  ." {"
;
                                       \ escape some common RTF characters
: %type                                ( a n --)
  begin
    dup                                \ end of line?
  while                                \ if not, check character
    over c@ dup false s" \{}" bounds break?
    if [char] \ emit then emit chop
  repeat 2drop                         \ if special, escape it
;                                      \ drop the empty string
                                       \ internal and external words
: type_ type space ;                   ( a n --)
: (enclose) ." {\" type_ %type ." }" space ;
: %cr ." \par" cr ;                    ( --)
: %print %type space ;                 ( a n --)
: %println %type %cr ;                 ( a n --)
: begins 1 (item#) ! type cr ;         ( a n --)
: ends 2drop [char] } emit cr ;        ( a n --)
: %endRTF ." }}" cr ;                  ( --)
: %page ." \page" cr ;                 ( --)
: %bold s" b" (enclose) ;              ( a n --)
: %italic s" i" (enclose) ;            ( a n --)
: %typewriter s" f3" (enclose) ;       ( a n --)
: %smallcaps s" scaps" (enclose) ;     ( a n --)
: %double ." {\ldblquote " %type ." \rdblquote}" space ;
: %single ." {\lquote " %type ." \rquote}" space ;
: %link (link type %type link) type %type ." }}}" space ;
: %line (line) type cr ;               ( --)
: %describe (description) type cr 2swap %bold %println ;
: %item (description) type_ (bullet) type cr %println ;
: %caption (caption) type 1 (table#) dup @ 0 .r +! ." : " %type ." }" %cr ;
: %RTFarticle 0 to (document) ;        ( --)
: %RTFbook    1 to (document) ;        ( --)
                                       \ print a numbered item
: %enumeration                         ( a n --)
  (description) type cr 1 (item#) dup @ 3 .r +! ." .\tab" cr %println
;
                                       \ print a row of cells
: %cells                               ( a1 n1 a2 n2 ax nx x --)
  ." {\trowd" (twips) over / over 1+ 1 ?do
    (rowheader) type dup i * 0 .r cr   \ print RTF headers
  loop drop                            \ drop the count
                                       \ put strings on return stack
  dup begin dup while 1- rot >r rot >r repeat drop
  begin dup while 1- (cell type r> r> %type cell) type cr repeat drop
  ." \row}" cr                         \ retrieve strings and print cells
;
                                       \ print an RTF title in LaTeX style
: %RTFtitle                            ( a1 n1 a2 n2 f -- )
  (title)  type_ drop %println
  (author) type_ %println
  (author) type_ s" \chdate" type_ %cr
;
                                       \ section generating words
: .section# (sections) begin dup @ 0 .r cell+ dup @ while ." ." repeat drop ;
: .Chapter %page (ChapA) type cr (ChapB) type .section# %cr (ChapC) type %println ;
: .Heading2 (Head2) type .section# 2 spaces %println ;
: .Heading3 (Head3) type .section# 2 spaces %println ;
: .Heading4 (Head4) type %println ;    ( a n --)
: .Heading5 (Head5) type %println ;    ( a n --)
: .Heading6 (Head6) type %println ;    ( a n --)
                                       \ this selects the proper section word
create .section                        \ based on the value of (current)
  ' .Chapter ,
  ' .Heading2 ,
  ' .Heading3 ,
  ' .Heading4 ,
  ' .Heading5 ,
  ' .Heading6 ,
does>                                  \ calculate offset using (current)
  (current) @ (sections) - 1 cells / (document) - th
  @c execute (paragraph) type cr       \ compensate for document type
;
                                       \ increment depth and section number
: %subSection 1 dup (current) @ +! cells (current) +! .section ;
: %endSection 0 (current) @ ! -1 cells (current) +! ;
                                       \ decrement depth and section number
[DEFINED] 4TH# [IF]
  hide (#section)
  hide (sections)
  hide (document)
  hide (item#)
  hide (table#)
  hide (current)
  hide (twips)
  hide (brace)
  hide (paragraph)
  hide (ChapA)
  hide (ChapB)
  hide (ChapC)
  hide (Head2)
  hide (Head3)
  hide (Head4)
  hide (Head5)
  hide (Head6)
  hide (bullet)
  hide (rowheader)
  hide (cell
  hide cell)
  hide (link
  hide link)
  hide (title)
  hide (author)
  hide (description)
  hide (caption)
  hide type_
  hide (enclose)
  hide .section#
  hide .Chapter
  hide .Heading2
  hide .Heading3
  hide .Heading4
  hide .Heading5
  hide .Heading6
  hide .section
[THEN]
[THEN]

\ %RTFarticle
\ %beginRTF
\   s" Hans Bezemer" s" This is a sample article" false %RTFtitle
\   s" First section" %subSection
\   s" This is something else, isn't it? Some say, you cannot" %print
\   s" quote" %double s" in LaTeX." %print s" But I have to" %print
\   s" stress" %italic s" this, it is" %print s" not" %bold s" true!" %println
\ %endRTF

