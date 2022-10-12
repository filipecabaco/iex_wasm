\ 4tH demo - Fixed length fields - Copyright 2017 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/fixedfld.4th               \ for NEXT-FIELD

\ This program requires a TXT file which uses data from:
\ https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States
\ It can be found in the "/apps/data" directory.

                                       \ this is the layout (field lengths)
create states-fields 20 , 2 , 14 , 8 , 7 , 2 , 0 ,
/layout array states-layout            \ this is the layout variable
                                       \ this wraps it into a definition
: !refill states-fields tib states-layout fields! refill ;
: field> states-layout next-field -trailing ;
: .tab 9 emit ;                        \ emit a tab

: OpenFiles                            ( -- h1 h2)
  s" ustates.txt" input  open error? abort" Cannot open 'ustates.txt'"
  s" ustates.tsv" output open error? abort" Cannot open 'ustates.tsv'"
  over use dup use                     \ open and use the files
;

: Process                              ( --)
  ." State"      .tab ." Abbreviation" .tab ." Capital"     .tab
  ." Population" .tab ." Area"         .tab ." House Seats" cr
                                       \ print the header
  begin
    !refill                            \ get the next line
  while
    field> type .tab                   \ get and print all the fields
    field> type .tab
    field> type .tab
    field> type .tab
    field> type .tab
    field> type cr                     \ terminate last line
  repeat
;

: CloseFiles close close ;             ( h1 h2 --)
: Convert OpenFiles Process CloseFiles ;

Convert