\ 4tH demo - ETL demo - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/etl.4th                    \ for READ-HEADER
include lib/parsing.4th                \ for PARSE-CSV
include lib/csvfrom.4th                \ for CSV>
include lib/scomma.4th                 \ for DS>COMMA
include lib/ulcase.4th                 \ for S>UPPER

\ This program requires a CSV file which uses data from:
\ https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States
\ It can be found in the "/apps/data" directory.

char ; constant delimiter              \ USTATES.CSV uses a ; as delimiter

struct
  16 +field Population                 \ contains the population of the state
  32 +field State                      \ contains the state name
  16 +field Capital                    \ contains the capital
buffer: States                         \ define the buffer right away

\ Note S>UPPER transforms the string in place and >COMMA uses PAD

: .tab 9 emit ;                        ( --)
: field> delimiter parse-csv csv> ;    ( -- a n)
: none 2drop ;                         ( a n --)
: >upper s>upper 2drop ;               ( a n --)
: >comma over swap ds>comma rot place ;

\ This one maps the label, the fieldname and the transform routine
create Mapper
  ," Population" ' Population , ' >comma ,
  ," State"      ' State ,      ' none ,
  ," Capital"    ' Capital ,    ' >upper ,
  NULL ,

\ Let 4tH figure out for you how many lines Mapper contains
here Mapper 1+ - /fieldmap / constant #etl
#etl /etl * array Transpose            \ allocate the transformation array
                                       \ open all files
: OpenFiles                            ( -- h1 h2)
  s" ustates.csv" input  open error? abort" Cannot open 'ustates.csv'"
  s" ustates.tsv" output open error? abort" Cannot open 'ustates.tsv'"
  over use dup use
;
                                       \ now read the CSV header
: GetHeader                            ( -- x n)
  refill 0= abort" Cannot read header" \ abort on error
  Transpose Mapper ['] field> read-header
  ." Population" .tab ." State" .tab ." Capital" cr
;                                      \ read header and write TSV header
                                       \ process the data of the file
: ProcessFile                          ( x n --)
  2>r States begin                     \ throw buffer address on the stack
    refill                             \ refill the buffer
  while                                \ as long as there are still lines
    dup 2r@ rot ['] field> read-tuple  \ read a line and write it out
    States -> Population count type .tab
    States -> State      count type .tab
    States -> Capital    count type cr
  repeat drop 2r> 2drop                \ do some clean up
;

: CloseFiles close close ;             ( h1 h2 --)
: Convert OpenFiles GetHeader ProcessFile CloseFiles ;

Convert