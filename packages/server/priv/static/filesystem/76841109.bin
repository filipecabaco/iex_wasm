\ uBasic unlabeler - Copyright 2011,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ for ARG-OPEN
include lib/parsname.4th               \ for PARSE-NAME
include lib/row.4th                    \ for ROW
include lib/leading.4th                \ for -LEADING

128 constant #label                    \ number of labels in uBasic
#label 1+ array label                  \ label buffer
                                       ( label tol -- label tol f)
: duplicate? >r label r@ th @ over = r> swap ;
: number>? parse-name number error? 0= ;
                                       ( -- n f)
: label-listed?                        ( label -- label tol f)
  label @ >r 1                         \ setup loop
  begin
    dup r@ <                           \ loop limit reached?
  while                                \ if duplicate label then exit
    duplicate? if drop r> true exit else 1+ then
  repeat drop r> false                 \ unique label, exit
;
                                       \ conditionally store label
: label!                               ( --)
  label @ #label = abort" Too many jumps"
  label-listed? if drop drop else cells label + ! 1 label +! then
;

: .label                               ( -- a n)
  number>?                             \ get a number
  if                                   \ is it a number?
    label-listed? nip                  \ is there a jump to this label?
    if 4 .r space else drop 5 spaces then 0 parse
  else                                 \ if it's not a number
    drop 5 spaces tib count            \ print just 5 spaces
  then                                 \ and the entire line (a bit dirty)
;
                                       \ print a line
: .line .label -leading type cr ;      ( --)
: Usage argn 3 < abort" Usage: ubulabel infile outfile" ;
: (jump) number>? if label! else drop then ;
                                       ( --)
create jump?                           \ GOTO and GOSUB contain labels
  ," GOTO"  ' (jump) ,
  ," GOSUB" ' (jump) ,
  ," THEN"  ' (jump) ,
  NULL ,
does> 2 string-key row if cell+ @c execute else drop then 2drop ;
                                       ( --)
: scan-label begin parse-name dup while jump? repeat 2drop ;
: Pass1 begin refill while scan-label repeat ;
: Pass2 begin refill while .line repeat ;
                                       ( --)
: unlabel                              ( --)
  Usage 1 label !                      \ setup label cache
  input  1 arg-open Pass1 dup rewind abort" Cannot rewind file"
  output 2 arg-open Pass2 close close  \ rewrite program
;

unlabel
