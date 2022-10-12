( Program by Leo Brodie)

[needs lib/enter.4th]

CREATE ROMANS    ( ones)      CHAR I , CHAR V ,
                 ( tens)      CHAR X , CHAR L ,
                 ( hundreds)  CHAR C , CHAR D ,
                 ( thousands) CHAR M ,

VARIABLE COLUMN# ( current offset)
: ONES       0 COLUMN# ! ;
: TENS       2 COLUMN# ! ;
: HUNDREDS   4 COLUMN# ! ;
: THOUSANDS  6 COLUMN# ! ;

: COLUMN  ( -- address of column)  ROMANS  COLUMN# @ + ;

: .SYMBOL  ( offset -- )  COLUMN +  @C EMIT ;
: ONER    0 .SYMBOL ;
: FIVER   1 .SYMBOL ;
: TENER   2 .SYMBOL ;

: ONERS  ( # of oners -- )
  0 ?DO ONER  LOOP ;
: ALMOST  ( quotient of 5 / -- )
  ONER  IF  TENER  ELSE  FIVER  THEN ;
: DIGIT  ( digit -- )
  5 /MOD  OVER  4  =  IF  ALMOST  DROP  ELSE  IF  FIVER  THEN
  ONERS THEN ;

: ROMAN  ( number --)  1000 /MOD THOUSANDS DIGIT
                        100 /MOD HUNDREDS DIGIT
                         10 /MOD TENS DIGIT
                                 ONES DIGIT ;

: PROMPT ( -- )
  ." Enter number: " enter
  ." Roman number: " roman  cr
;

prompt
