\ 4tH - Trigger to SQL converter - Copyright 2009, 2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Experimental program to convert the CSV trigger files from MySQL
\ to executable MySQL scripts. USE AT YOUR OWN RISK!

include lib/scanskip.4th

char , constant comma                  \ comma character
char " constant quote                  \ quote character
    10 constant lf                     \ linefeed character
     8 constant #fields                \ number of fields in trigger CSV
 32768 constant /buffer                \ size of CSV buffer
 
struct                                 \ structure holding the trigger
    32 +field triggername              \ name of the trigger
    16 +field event                    \ event triggering the trigger
    32 +field sqltable                 \ table of trigger
  1024 +field statement                \ trigger code
    64 +field timing                   \ triggers before or after event
end-struct /trigger

/trigger string trigger                \ trigger structure allocation
/buffer  string buffer                 \ buffer allocation

: field> >in +! quote parse ;          \ get a field
: record> lf parse 2drop ;             \ drop a field
: usage abort" Usage: csv2sql csv-file sql-file" ;
: Postprocess ." DELIMITER ;" cr ;     \ restore delimiter
: .sql -trailing dup if 4 spaces type cr else 2drop chop then ;

: Preprocess
  refill 0= abort" Cannot read header"                \ read header 
  0 begin comma parse while drop 1+ repeat            \ count # of fields
  drop #fields <> abort" Not a trigger CSV"           \ check on # of fields
  buffer /buffer 2dup accept                          \ read in entire file
  tuck = abort" File too large"                       \ check size
  2dup chars + 0 swap c! source! 0 >in !              \ delimit, assign buffer
  ." DELIMITER $$" cr cr                              \ write header
;

: Read-file
  1 field> dup >r      trigger -> triggername place   \ get triggername
  2 field> dup r> + >r trigger -> event       place   \ get event
  2 field> dup r> + >r trigger -> sqltable    place   \ get tablename
  2 field> dup r> + >r trigger -> statement   place   \ get statement
  2 field> dup r> + >r trigger -> timing      place   \ get timing
  record> r> 0<>                                      \ skip remaining 
;  
  
: Process
  ." CREATE TRIGGER "                                 \ CREATE TRIGGER
  trigger -> triggername count type space             \ write trigger name
  trigger -> timing      count type space             \ write trigger timing
  trigger -> event       count type ."  ON "          \ write trigger event
  trigger -> sqltable    count type cr                \ write trigger table
  ."   FOR EACH ROW" cr                               \ FOR EACH ROW
  trigger -> statement   count 2dup                   \ write trigger statement
  bounds ?do i c@ 13 = if bl i c! then loop           \ clear carriage returns
  begin -trailing dup while lf split .sql repeat      \ write statements
  2drop ." $$" cr cr                                  \ finalize trigger
;

include lib/convert.4th
