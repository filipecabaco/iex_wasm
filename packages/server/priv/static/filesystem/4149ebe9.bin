\ 4tH template for conversion utilities
\ Copyright 2002,2013 - J.L. Bezemer

\ This file is not intended for standalone use.
\ You will have to define the following words:

\ Usage       ( f --) : abort" Your error message"   
\ PreProcess  ( --)   : Actions before the file is read      (optional)
\ Read-file   ( -- f) : How to read the file, e.g. refill    (optional)
\ Process     ( --)   : What to do (after each Read-file if applicable)
\ PostProcess ( --)   : Actions after the file has been read (optional)

\ Has Usage been defined? If not, abort!
[UNDEFINED] Usage [IF]
[ABORT] [THEN]

\ Has Process been defined? If not, abort!
[UNDEFINED] Process [IF]
[ABORT] [THEN]

\ Special imode defined? If not, assume binary mode.
[UNDEFINED] imode [IF]
input constant imode
[THEN]

\ Special omode defined? If not, assume binary mode.
[UNDEFINED] omode [IF]
output constant omode
[THEN]

[NEEDS lib/argopen.4th]

\ Special options required? If undefined, abort!
[DEFINED] options [IF]
[UNDEFINED] get-options [IF]
[ABORT] [THEN]                         ( -- h h)
: OpenFiles                            \ open input and output files
  options get-options                  \ evaluate options
  omode option-index imode over 2 + argn > Usage
  over arg-open -rot 1+ arg-open       \ issue message if error
;
[ELSE]                                 ( -- h h)
: OpenFiles                            \ open input and output files
  argn 3 < Usage                       \ issue message if error
  imode 1 arg-open                     \ open the input file
  omode 2 arg-open                     \ open the output file
;
[THEN]

: ProcessFile                          \ process the input file line by line
[DEFINED] PreProcess  [IF]
  PreProcess                           \ do any preprocessing
[THEN]
[DEFINED] Read-file   [IF]
  begin Read-file while Process repeat \ read file and process line or buffer
[ELSE]
  Process                              \ self contained processing
[THEN]
[DEFINED] PostProcess [IF]
  PostProcess                          \ do any postprocessing
[THEN]
;

: CloseFiles close close ;             ( h h --)
: Convert OpenFiles ProcessFile CloseFiles ;

Convert