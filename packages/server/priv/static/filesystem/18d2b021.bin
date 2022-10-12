\ 4tH library - BROW - Copyright 2019 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Generic binary table-search routine

\ Parameters:  address of search key word
\              address of table
\              number of entries
\              number of columns (fields/entry)
\              value to search (string or integer)

\ Returns:     address of table 
\              row index
\              true flag if found

\ TYPICAL USE:
\ ============
\ create mystable
\   ," Aloha" 4 ,
\   ," Bye"   3 ,
\   ," Doei"  5 ,
\   ," Hello" 1 ,
\   here mystable - 2 / constant /mystable

\ create myntable
\   0 , 1 ,
\   1 , 3 ,
\   2 , 5 ,
\   3 , 7 ,
\   4 , 9 ,
\   here myntable - 2 / constant /myntable

\ s" Aha"      mystable /mystable 2 bstring-key brow . . . cr
\ s" Aloha"    mystable /mystable 2 bstring-key brow . . . cr
\ s" Bye"      mystable /mystable 2 bstring-key brow . . . cr
\ s" Hello"    mystable /mystable 2 bstring-key brow . . . cr
\ s" Gutentag" mystable /mystable 2 bstring-key brow . . . cr cr

\ -1 myntable /myntable 2 bnum-key brow . . . cr
\  0 myntable /myntable 2 bnum-key brow . . . cr
\  2 myntable /myntable 2 bnum-key brow . . . cr
\  4 myntable /myntable 2 bnum-key brow . . . cr
\  6 myntable /myntable 2 bnum-key brow . . . cr

\ NOTE: ALL TABLES MUST BE PROPERLY SORTED!!

[UNDEFINED] brow    [IF]
[UNDEFINED] bsearch [IF] include lib/bsearch.4th [THEN]
[UNDEFINED] compare [IF] include lib/compare.4th [THEN]

[UNDEFINED] (/key) [IF]                 \ default if not specified
64 constant (/key)                      \ size of temporary string storage
[THEN]
                                        \ temporary storage for a string-key
(/key) string (string-key) does> >r (/key) 1- min r@ place r> ;
variable (#column)                      \ number of columns per entry
                                        \ handle a number search
:token bnum-key                         ( n1 a2 n2 -- n3 f a2) 
  [: over over < negate >r > r> + ;] is b-compare 
  over >r bsearch r>
;
                                        \ handle a string search
:token bstring-key                      ( a1 n1 a2 n2 -- n3 f a2) 
  [: >r count r> count compare ;] is b-compare
  swap >r >r (string-key) r'@ r> bsearch r>
;
                                        \ binary search routine for tables
: brow                                  ( x a2 n2 n3 xt -- a2 n4 f)
  ['] b-compare defer@ >r ['] get-key defer@ >r
  [: swap (#column) @ * cells + @c ;] is get-key
  swap (#column) ! execute -rot
  r> is get-key r> is b-compare
;

[DEFINED] 4TH# [IF]
  hide (/key)
  hide (#column)
  hide (string-key)
[THEN]
[THEN]

