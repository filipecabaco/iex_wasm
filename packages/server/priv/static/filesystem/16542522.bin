\  *******************************************************************
\  *                                                                 *
\  *  Neil Bawd  2000-07-21                                          *
\  *                                                                 *
\  *                          Spell Distance                         *
\  *                                                                 *
\  *  Kernighan and Pike, _The Unix Programming Environment_, (1984) *
\  *  pp 208--214, give a name-correcting file lookup.  It uses a    *
\  *  function like the following `SPELL-DISTANCE`.  The K&P         *
\  *  definition uses C-style strings, so `SPELL-DISTANCE` had to    *
\  *  be written from scratch.                                       *
\  *                                                                 *
\  *  This is helpful with "word unknown" error.                     *
\  *  It catches the most common typing goofs.                       *
\  *                                                                 *
\  *******************************************************************

\  Spell-Distance  ( str1 len1 str2 len2 -- {0...3} )
\     Returns distance between two names.

\  Very rough spelling metric.

\   *  0 if the strings are identical.
\   *  1 if two characters are transposed.
\   *  2 if one character different, added, or deleted.
\   *  3 otherwise.

[UNDEFINED] spell-distance [IF]
[UNDEFINED] compare        [IF] include lib/compare.4th [THEN]


: Letter-Match                         ( str1 len str2 -- str' len' str2' )
  >R
  BEGIN dup WHILE
    over C@ R@ C@ =
  WHILE
    CHOP R> 1+ >R
  REPEAT                               [UNDEFINED] 4TH# [IF] THEN [THEN]
  R> ;

: Letter-Switch                        ( str1 len str2 -- flag )
  >r over r> swap C@  over 1+ C@ = NOT
  IF  DROP 2DROP FALSE  EXIT THEN
  >r over r> swap 1+ C@  over C@ = NOT
  IF  DROP 2DROP FALSE  EXIT THEN
  >R 2 /STRING R> 2 + over COMPARE 0= ;

: Spell-Distance                       ( str1 len1 str2 len2 -- {0...3} )
    ROT SWAP                           ( str1 str2 len1 len2)
                                       \ Save difference in lengths for later
    2dup - >R                          ( R: diff)
                                       \ Is difference in lengths > 1?
    R@ ABS 1 > IF
      R@ DROP 2DROP 2DROP 3            ( --)
    EXIT THEN

    MIN SWAP                           ( str1 len str2)
    Letter-Match
                                       \ Are words equal or a letter inserted/deleted?
    over 0= IF
      DROP 2DROP
      R> dup IF DROP 2 THEN
    EXIT THEN
                                       \ Do the words have the same length?
    R> dup 0= IF DROP
                                       \ Is the rest of the two words the same?
      >r over over r@ rot rot CHOP R> 1+ over COMPARE 0= IF
        DROP 2DROP 2
      EXIT THEN
                                       \ Is a letter switched with the next letter?
      Letter-Switch IF 1 ELSE 3 THEN
    EXIT THEN
                                       \ Is a letter deleted?
    0< IF
        1+ over COMPARE 0= IF 2 ELSE 3 THEN
    EXIT THEN
                                       \ Is a letter inserted?
    2>R 1+ 2R> over COMPARE 0= IF 2 ELSE 3 THEN
;

[DEFINED] 4TH# [IF]
  hide Letter-Match
  hide Letter-Switch
[THEN]
[THEN]




