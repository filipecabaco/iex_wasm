\ Converts textfiles to keduca sourcefiles - Copyright 2004, 2008 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ -- INPUT FORMAT --
\ o Save your file as plain text, CR and/or LF as terminators of options
\   and questions
\ o Every question or option has to start with an indicator, terminated
\   by a space, e.g. 1]
\ o The terminators of options and questions have to be different,
\   e.g. [1] a)
\ o A true option has to be indicated by a constant string at the very end
\   of the option, e.g. (T)
\ -- INPUT FORMAT --

\ -- PREREQUISITES --
\ o An initfile has to be present in the working directory with the name
\  'txt2kedu.rc'
\ o The format is:
\   title-string<lf>
\   category-string<lf>
\   question-char<lf> 
\   option-char<lf>
\   true-string<lf>
\ o Example:
\   Human genetics
\   Biology
\   ]
\   )
\   (T)
\ -- PREREQUISITES --

\ -- ADDITIONAL NOTES --
\ Kindly supplied by Javier - Seguros Campos
\ The header is optional, except <Info></Info>
\ ------
\ * TYPE
\ ------
\ 1- Test
\ 2- Test with Question Points
\ 3- Test with Answers Points
\ 4- Slidershow
\ 5- Exam
\ 6- Psychotechnic Test
\ -------
\ * LEVEL
\ -------
\ 1- Easy
\ 2- Normal
\ 3- Expert
\ 4- Supreme
\ -- ADDITIONAL NOTES --

[needs lib/startend.4th]
[needs lib/leading.4th]

variable option                        \ variable for option char
variable question                      \ variable for question char

false value terminate?                 \ print end question tag?
16 string istrue                       \ true option string
                                       \ CONVERT.4TH requirements
: Usage abort" Usage: txt2kedu infile.txt outfile.edu" ;
: Read-file refill ;
                                       \ read a trimmed line
: parse-trim 0 parse -leading -trailing ;
: typetag 2over ." <" type type ." </" type cr ;
: lastchar 1- chars + c@ ;             \ return last char of string
                                       \ get a line
: getline refill 0= abort" Error reading initfile" ;
: getstring getline parse-trim ;       \ get a string
: getchar getstring lastchar ;         \ get last character
: getheader getstring typetag ;        \ get header tag 

: beginheader                          \ print top of header
  ." <?xml version='1.0' encoding='ISO 8859-1' standalone='yes' ?>"
  ." <!DOCTYPE educa>" cr
  ." <Document>" cr                    \ print document tag
  ." <Info>" cr                        \ print info tag
;

: endheader                            \ print end of header
  ." <type>1</type>" cr                \ print type header
  ." <level>1</level>" cr              \ print level header
  ." <language>us</language>" cr       \ print language header
  ." </Info>" cr                       \ end of info tag
  ." <Data>" cr                        \ print data tag
;

: Preprocess                           \ print header
  beginheader                          \ print top of header
  s" txt2kedu.rc" input open error?    \ open init file
  abort" Cannot open initfile"         \ abort on error
  dup use                              \ use init file
  s" title>"    getheader              \ get title header
  s" category>" getheader              \ get category header
  getchar question !                   \ get question character
  getchar option !                     \ get option character
  getstring istrue place               \ get true option string
  close over use                       \ close & use inputfile again!
  endheader                            \ print rest of header
;
                                       \ terminate a question
: ?terminate                           ( --)
  terminate? if ." </question>" cr false to terminate? then
;

: Postprocess                          \ print the footer
  ?terminate                           \ check for unsolved termination
  ." </Data>" cr                       \ end of data tag
  ." </Document>" cr                   \ end of document tag
;
                                       \ do we have a true option?
: true?                                ( a n1 -- a n2 f) 
  istrue count dup >r                  \ save the count
  ends? dup                            \ does it ends with 'true'?
  if                                   \ if so, strip the true string
    r> swap >r - r>
  else
    r> drop                            \ if not, drop the count
  then
;
                                       \ process an option  
: do-option                            ( --)
  parse-trim true?                     \ is it a true option?
  if
    s" true>"
  else
    s" false>"
  then
  2swap typetag                        \ print appropriate tag
;
                                       \ process a question
: do-question                          ( --)
  ?terminate                           \ terminate previous tag?
  ." <question type='1'>" cr           \ open a new tag
  s" text>" parse-trim typetag         \ print text tag
  true to terminate?                   \ to be terminated!
;
                                       \ process the file
: Process                              ( --)
  bl parse-word dup 0=                 \ is it an empty line?
  if 
    2drop                              \ drop an empty line
  else
    lastchar dup                       \ get last character
    question @ = if do-question then   \ question found
    option   @ = if do-option   then   \ option found
  then
;

[needs lib/convert.4th]  


