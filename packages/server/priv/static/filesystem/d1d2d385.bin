\ LaTeX.f - LaTeX documentation support

\ Copyright (c) 2009 Dennis Ruffer

\ Permission is hereby granted, free of charge, to any person obtaining a copy
\ of this software and associated documentation files (the "Software"), to
\ deal in the Software without restriction, including without limitation the
\ rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
\ sell copies of the Software, and to permit persons to whom the Software is
\ furnished to do so, subject to the following conditions:

\ The above copyright notice and this permission notice shall be included in
\ all copies or substantial portions of the Software.

\ THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
\ IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
\ FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
\ AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
\ LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
\ FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
\ IN THE SOFTWARE.

\ Extensions and 4tH version, (c) 2010, 2016 Hans Bezemer

[UNDEFINED] begins [IF]                \ incompatible with html.4th, rtf.4th
[UNDEFINED] break? [IF] include lib/breakq.4th  [THEN]

variable %section   1 %section !

s" enumerate"   sconstant %enumerate
s" description" sconstant %description
s" quote"       sconstant %quote
s" itemize"     sconstant %itemize
s" verse"       sconstant %verse
s" verbatim"    sconstant %listing
s" tabular"     sconstant %table
s" table"       sconstant %tablefloat
s" center"      sconstant %center
s" flushleft"   sconstant %left
s" flushright"  sconstant %right

create tableSection
  ," \part"
  ," \chapter"
  ," \section"
  ," \subsection"
  ," \subsubsection"
  ," \paragraph"
  ," \subparagraph"                    \ variable nested sectioning control
does> swap 6 min cells + @c count ;
                                       \ escape some common LaTeX characters
: %type                                ( a n --)
  begin
    dup                                \ end of line?
  while                                \ if not, check character
    over c@ dup false s" %${_#&}" bounds break?
    if [char] \ emit then emit chop
  repeat 2drop                         \ if special, escape it
;                                      \ drop the empty string

: %print %type cr ;                    ( a n --)
: {type} ." {" %type ." }" cr ;        ( a n -- )
: .mm 0 .r ." mm"  cr ;                ( n --)
: %subSection %section @ tableSection type {type} cr 1 %section +! ;
: %endSection -1 %section +! ;         ( -- )
: begins ." \begin" {type} ;           ( a n --)
: ends   ." \end"   {type} ;           ( a n --)
: %describe 2swap ." \item["  %type ." ] " %print ;
: %item ." \item " %print ;            ( a n --)
: %texArticle 2 %section ! ." \documentclass{article}" cr ;
: %texBook    1 %section ! ." \documentclass{book}"    cr ;
: %endTex ." \end{document}" cr ;      ( -- )
: %line ." \hline" cr ;                ( --)
: %caption ." \caption" {type} ;       ( a n --)
: %package ." \usepackage" {type} ;    ( a n --)
: %package! 2swap ." \usepackage[" type ." ]" {type} ;
: %bold ." \textbf" {type} ;           ( a n --)
: %italic ." \textit" {type} ;         ( a n --)
: %smallcaps ." \textsc" {type} ;      ( a n --)
: %typewriter ." \texttt" {type} ;     ( a n --)
: %double ." ``" %type ." ''" cr ;     ( a n --)
: %single ." `" %type ." '" cr ;       ( a n --)
: %cr ." \linebreak" cr ;              ( --)
: %page ." \pagebreak" cr ;            ( --)
: %paragraph ." \parskip " .mm ." \parindent " .mm ;

[DEFINED] UseURLs [IF]
: %link ." \href{" type ." }" {type} ; ( a1 n1 a2 n2 --)
[ELSE]
: %link 2drop %print ;
[THEN]
                                       ( a1 n1 a2 n2 --)
: %beginTex                            ( -- )
  ." \usepackage{graphics}" cr
  [defined] UseURLs [if] ." \usepackage{hyperref}" cr [then]
  ." \begin{document}" cr cr
;
                                       \ print table cells
: %cells                               ( a1 n1 .. ax nx n2 --)
  1- dup                               \ decrement index, reverse strings
  begin dup while 1- rot >r rot >r repeat
  drop -rot %type                      \ drop index, print first string
  begin dup while 1- ."  & " r> r> %type repeat
  drop ."  \\" cr                      \ print rest of strings, end row
;
 
: %texTitle                            ( a1 n1 a2 n2 f --)
  ." \title" >r {type}
  ." \author" {type}     cr
  ." \maketitle"         cr cr
  r> if ." \tableofcontents{}" cr cr then
;

aka {type} %layout
aka %cells %heads

[DEFINED] 4TH# [IF]
  hide {type}
  hide .mm
  hide tableSection
[THEN]
[THEN]

\ %texArticle
\ %beginTex 0 2 %paragraph
\   s" Hans Bezemer" s" This is a sample article" false %texTitle
\   s" First section" %subSection
\   s" This is something else, isn't it? Some say, you cannot" %print
\   s" quote" %double s" in LaTeX." %print s" But I have to" %print
\   s" stress" %italic s" this, it is" %print s" not" %bold s" true!" %print
\ %endTex
