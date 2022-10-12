\ Copyright 2003,2012 - J.L. Bezemer
\ Converts textfiles to LyX sourcefiles

\ -- INPUT FORMAT --
\ o Save your file as plain text, CR and/or LF as
\   terminators of PARAGRAPHS
\ o MS-Word, use Text (*.txt) or MS-DOS text (*.txt)
\ o Fancy layouts are obviously lost!
\ -- INPUT FORMAT --

\ -- BUGS & LIMITATIONS --
\ o In some rare cases, spaces are omitted between words
\ o TABS are converted to SPACE
\ o Other non-printable characters are replaced by ^
\ o Empty lines can create empty paragraphs
\ o Lines not terminated by a '.' are handled differently
\ -- BUGS & LIMITATIONS --

[NEEDS lib/ascii7.4th]

80 constant maxcpl                     \ how many characters per line
/tib 1- constant tib|              \ address of the end of TIB

variable cpl                           \ number of characters output

true value nospace?                    \ should we emit a space?

: newline cr 0 cpl ! ;                 \ start a new line

: Preprocess                           \ REQUIRED by convert.4th
  ." #4tH 3.5b created this file. For more info see http://hansoft.come.to/" cr
  ." \lyxformat 221" cr                \ other possible versions are:
  ." \textclass article" cr            \ 210, 215, 216, 217, 218, 220
  ." \begin_preamble" cr               \ may be dropped (KLyX)
  ." \usepackage{latexsym}" cr         \ may be dropped (KLyX)
  ." \end_preamble" cr                 \ may be dropped (KLyX)
  ." \language dutch" cr               \ 'english' is ok too ;-)
  ." \inputencoding auto" cr
  ." \fontscheme pslatex" cr
  ." \graphics default" cr
  ." \paperfontsize default" cr
  ." \spacing single " cr
  ." \papersize a4paper" cr
  ." \paperpackage a4" cr
  ." \use_geometry 0" cr
  ." \use_amsmath 0" cr
  ." \use_natbib 0" cr                 \ 221 only
  ." \use_numerical_citations 0" cr    \ 221 only
  ." \paperorientation portrait" cr
  ." \secnumdepth 3" cr
  ." \tocdepth 3" cr
  ." \paragraph_separation indent" cr  \ 'skip' is ok too
  ." \defskip medskip" cr
  ." \quotes_language english" cr
  ." \quotes_times 2" cr
  ." \papercolumns 1" cr
  ." \papersides 1" cr
  ." \paperpagestyle default" cr cr
  ." \layout Standard"
  newline
;

: PostProcess                          \ REQUIRED by convert.4th
  ." \layout Standard" cr cr
  ." \the_end" cr
;
                                       \ REQUIRED by convert.4th
: Usage abort" Usage: txt2lyx infile outfile " ;

: Read-file refill ;                   \ REQUIRED by convert.4th
                                       \ if true, do a CR
: ?cr                         ( f --)
  if newline then
;
                                       \ do we cross the MaxCPL limit?
: ?eol                        ( n --)
  cpl @ + maxcpl > ?cr        ( --)
;
                                       \ is the last char a '.'?
: ?dot                        ( a n --)
  1- chars + c@               ( c)
  [char] . = ?cr              ( --)
; 
                                       \ if true, emit a space
: ?space                      ( --)
  nospace? if              
    false to nospace?                  \ reset nospace? flag
  else
    space 1 cpl +!                     \ output a space
  then
;
                                       \ output a space and a word
: .word                       ( a n --)
  dup ?eol                    ( a n)   \ do we cross the linesize?
  ?space dup cpl +!           ( a n)   \ update printed chars
  over over type              ( a n)   \ now type the word
  ?dot                        ( --)    \ does the word end with a dot?
;
                                       \ blank at end of buffer?
: bl-at-end?                  ( f --)
  if                          ( --)
    newline                            \ print LyX header
    ." \layout Standard"               \ we're starting a new paragraph
    newline
    true                               \ first line no space
  else
    >in @ tib| =                       \ scanned the last char?
    tib tib| 1- chars + c@ bl <>       \ and: last char not a space?
    and                                \ then: we will not print a space
  then to nospace?
;
                                       \ blank at begin of buffer?
: bl-at-start?                ( a --)
  c@ bl <>                    ( f)
  nospace? and to nospace?    ( --)
;
                                       \ get flags
: status?                     ( n -- f1 f2)
  tib| over <> swap 0=        ( f f)
;
                                       \ REQUIRED by convert.4th
: Process
  tib count                   ( a n)   \ equivalent to SOURCE
  swap over over              ( n a n a) 
  bl-at-start?                ( n a n) \ check start buffer
  s>ascii7 drop drop          ( n)     \ clean buffer                   
  status? if                  ( f)     \ if set, we add some space
    ." \added_space_top bigskip" cr drop
  else                        ( f)     \ otherwise we got a full buffer
    begin                     ( f) 
      bl parse-word           ( f a n) \ parse for a blank
      dup 0<>                 ( f a n f) 
    while                     ( f a n) \ if successful then
      .word                   ( f a n) \ output the word
    repeat                    ( f --)  \ and get next word
    drop drop                 ( f)     \ drop addr/len
    bl-at-end?                ( --)    \ check end buffer
  then                        ( --)    \ buffer processed
;

[needs lib/convert.4th]


