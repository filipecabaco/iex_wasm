\ -- CHARSCAN -- Wil Baden  2002-03-17

\  *********************************************************************
\  *     Extract Substring from String                                 *
\  *********************************************************************

\ th-Word  th-Word-Forward  th-Word-Back

[UNDEFINED] th-Word [IF]
[UNDEFINED] SKIP    [IF] include lib/scanskip.4th [THEN]
: th-Word-Forward           ( str /str n -- str+i /str-i )
    dup IF 1 ?DO BL SKIP BL SCAN LOOP BL SKIP ELSE DROP THEN ;

: th-Word                   ( str /str n -- str+i /str-i )
    dup IF th-Word-Forward ELSE DROP THEN 2dup BL SCAN NIP - ;

: th-Word-Back              ( str /str n -- str /str-i )
    >R 2dup R> th-Word-Forward NIP -  ;
[THEN]

\ s" This is the end, beautiful friend" 2dup 3 th-word type cr
\ 2dup 2 th-word-forward type cr 5 th-word-back type cr
 
