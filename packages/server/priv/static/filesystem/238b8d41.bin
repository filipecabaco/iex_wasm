\ LDIF to CSV converter - Copyright 2006,2011 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/compare.4th
include lib/argopen.4th
include lib/anscore.4th

1024 constant /fields                  \ size of fields buffer
4096 constant /contents                \ size of contents buffer
 128 constant max-fields               \ maximum number of fields
 
/fields   string fields                \ fields buffer
/contents string contents              \ contents buffer

  char : value ldif                    \ ldif delimiter
  char ; value csv                     \ csv delimiter
  fields value eof                     \ next offset fields buffer
contents value eoc                     \ next offset contents buffer
       0 value #fields                 \ number of fields in file
                                       \ mapping contents to fields
max-fields array field# does> swap cells + ;

: equals? count 2over compare 0= ;     ( a1 n1 a2 -- a1 n1 f) 
: length  count nip 1+ ;               ( a -- n)
                                       \ was field already declared?
: CheckFields                          ( a1 n1 -- a1 n1 f)
  eof fields ?do
    i equals? if unloop true exit then i length
  +loop false
;
                                       \ return position of field
: SequenceField                        ( -- n2 a1 n1)
  eoc 0 ldif parse eof fields ?do
    i equals? if unloop exit then rot 1+ -rot i length
  +loop
;

: ?csv if csv emit then ;              ( --)
: ResetEoC contents to eoc ;           ( --)
: ResetContents contents /contents erase ;
: ResetField# #fields 0 do 0 i field# ! loop ;
: ClearContent ResetEoc ResetContents ResetField# ;
: >field >r tuck r@ place 1+ chars r> + ;
: Record? 0 #fields 0 do i field# @ 0<> if 1+ then loop ;
: WriteField dup ?csv field# @ dup if count type else drop then ;
: WriteRecord Record? if #fields 0 do i WriteField loop cr ClearContent then ;
: >str dup fields <> ?csv count tuck ;
: WriteHeader 0 eof fields ?do 1+ i >str type 1+ chars +loop cr ;
: AppendContent SequenceField 2drop field# ! 0 parse eoc >field to eoc ;
: AddContent tib count -trailing nip if AppendContent else WriteRecord then ;
: AppendField CheckFields if 2drop else eof >field to eof then ;
: Addfield  ldif parse dup 0= if 2drop else AppendField then ;
: CollectFields begin refill while AddField repeat ;
: WriteContent begin refill while AddContent repeat ;

: convert
  argn 4 < abort" Usage: ldif2csv ldif-delimiter csv-delimiter ldif-file csv-file"
  1 args drop c@ to ldif               \ get ldif delimiter
  2 args drop c@ to csv                \ get csv delimiter
  output 4 arg-open                    \ open output file
  input 3 arg-open                     \ open input file
  CollectFields                        \ scan file for field declarations
  WriteHeader to #fields               \ write the header
  dup rewind abort" Cannot rewind file"
  WriteContent                         \ rewind and write the contents
  close close                          \ close all files
;

convert