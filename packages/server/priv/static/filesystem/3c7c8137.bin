\ uBasic relabeler - Copyright 2011,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/argopen.4th                \ for ARG-OPEN
include lib/parsname.4th               \ for PARSE-NAME
include lib/row.4th                    \ for ROW

999 constant #label                    \ number of labels
#label 1+ array label               \ label buffer
                                       ( label tol -- label tol f)
: duplicate? >r label r@ th @ over = r> swap ;
: number>? parse-name number error? 0= ;
                                       ( -- n f)
: label-listed?                        ( label -- label idx tol f)
  label @ >r 1                         \ setup loop
  begin
    dup r@ <                           \ loop limit reached?
  while                                \ if duplicate label then exit
    duplicate? if r> true exit else 1+ then
  repeat r> false                      \ unique label, exit
;
                                       \ conditionally store label
: label!                               ( label --)
  label @ #label = abort" Too many labels"
  label-listed? abort" Duplicate label" nip cells label + ! 1 label +!
;                                      \ abort if duplicate label is found
                                       ( label -- label')
: >label label-listed? 0= abort" Undefined label" drop 10 * nip ;
: .label number>? if >label 4 .r else drop 4 spaces 0 >in ! then ;
: Usage argn 3 < abort" Usage: ubrlabel infile outfile" ;
                                       \ relabel jumps accordingly
: (jump)                               ( --)
  space parse-name 2dup number error? if drop type else >label 0 .r 2drop then
;
                                       ( --)
create jump?                           \ GOTO and GOSUB contain labels
  ," GOTO"  ' (jump) ,
  ," GOSUB" ' (jump) ,
  ," THEN"  ' (jump) ,
  NULL ,
does> 2 string-key row if cell+ @c execute else drop then 2drop ;
                                       ( --)
: scan-label number>? if label! else drop then ;
: parse-line begin parse-name dup while space 2dup type jump? repeat 2drop ;
: Pass1 begin refill while scan-label repeat ;
: Pass2 begin refill while .label parse-line cr repeat ;
                                       ( --)
: relabel                              ( --)
  Usage 1 label !                      \ setup label cache
  input  1 arg-open Pass1 dup rewind abort" Cannot rewind file"
  output 2 arg-open Pass2 close close  \ rewrite program
;

relabel
