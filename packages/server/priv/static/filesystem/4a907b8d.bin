\ 4tH template - QUIZ - Copyright 2004 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ *****
\ You need to define INTRO, QUESTIONS and #OPTIONS
\ before including this template.
\ *****

\ INTRO is a word, displaying some text
[UNDEFINED] intro [IF] [ABORT] [THEN]

\ QUESTION is an array of question, options, correct char
[UNDEFINED] questions [IF] [ABORT] [THEN]

\ #OPTIONS is a constant of the number of options/question
[UNDEFINED] #options [IF] [ABORT] [THEN]

: tabit cr 3 spaces ;
: next-field cell+ dup @c ;

\ get a key from the keyboard - WAITS!
: getkey  ( -- c)
  pad begin dup 1 accept 0> until
  c@ bl or
;

\ print a question and increase counter
: PrintQuestion                        ( a n -- n+1)
  cr cr                                ( a n)
  1+ dup 0 .r ." . "                   ( a n+1)
  swap count type                      ( n+1)
;

\ print a option and increase address and character
: Option                               ( a1 c -- a1+1 c+1)
  tabit
  [char] ( emit                        ( a1 c)
  dup      emit                        ( a1 c)
  [char] ) emit                        ( a1 c)
  space                                ( a1 c)
  1+ swap                              ( c+1 a1)
  next-field                           ( c+1 a1+1 a2)
  count type swap                      ( a1+1 c+1)                  
;

\ print all options
: PrintOptions                         ( a c --  a+n)
  #options 0 do Option loop cr cr drop ( a+n)
;

\ prompt an answer from the user and evaluate
: GetAnswer                            ( n c -- n+1)
  ." Answer:  " getkey = tabit
  if
    ." C" 1+
  else
    ." Inc"
  then                                 \ duplicate strings!
  ." orrect, your score is now " dup .
;

\ pose a question and get an answer
: PoseQuestion                         ( n1 n2 a1 a2 -- n1+1 n2+1 a1+n3+2)
  rot                                  ( n1 a1 a2 n2)
  PrintQuestion                        ( n1 a1 n2+1)
  swap                                 ( n1 n2+1 a1)
  [char] a                             ( n1 n2+1 a1 c) 
  PrintOptions                         ( n1 n2+1 a1+n)
  rot swap                             ( n2+1 n1 a1+n)
  next-field                           ( n2+1 n1 a1+n+1 c)
  rot swap                             ( n2+1 a1+n+1 n1 c)
  GetAnswer                            ( n2+1 a1+n+1 n1+1)
  -rot cell+                           ( n1+1 n2+1 a1+n+2)
;

\ evaluate the end result
: ShowResult                           ( n1 n2 --)
  cr cr
  ." We posed you " .                  ( n1)
  ." questions. You answered "         ( n1)
  . ." correctly." cr cr               ( --)
;

\ start asking questions
: quiz
  cr cr intro
  0 0 questions                        ( n1 n2 a1)

  begin                                ( n1 n2 a1)
    dup @c dup NULL <>                 ( n1 n2 a1 a2 f) 
  while                                ( n1 n2 a1 a2)
    PoseQuestion                       ( n1 n2 a1)
  repeat                               ( n1 n2 a1)

  drop drop                            ( n1 n2)
  ShowResult                           ( --)
;

quiz
