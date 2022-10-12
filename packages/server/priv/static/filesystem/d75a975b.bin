\ 4tH library - REPLACES SUBSTITUTE UNESCAPE - Copyright 2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] replaces  [IF]
[UNDEFINED] split     [IF] include lib/scanskip.4th [THEN]
[UNDEFINED] compare   [IF] include lib/compare.4th  [THEN]
[UNDEFINED] callocate [IF] include lib/memchar.4th  [THEN]

0   enum SE.NOERROR                    \ no errors
    enum SE.NOALLOC                    \ allocation error
constant SE.TOOMANY                    \ too many substitutions defined

char % constant |s|                    \ delimiters, both in character
s" %" sconstant "|s|"                  \ and string form

128 constant #subst                    \ maximum number of substitutions
 16 constant /name                     \ maximum length of a substitution name

variable subst#                        \ number of substitutions
variable SubstErr                      \ last substitution error
variable SubstDone                     \ number of substitutions performed

struct                                 \ structure for substitution
  /name +field (name)                  \ name of the substitution
  nell  +field (addr)                  \ start in substitution buffer
end-struct /subst                      \ size of substitution structure
                                       \ allocate substitution array
#subst /subst * buffer: (subst) does> swap /subst * + ;
                                       ( f n --)
: (?throw) swap if throw else drop then ;
: (error?) catch dup SubstErr ! ;      ( xt -- n)
                                       \ is a substitution defined?
: (defined?)                           ( a n1 -- n2 a n1 f)
  2>r subst# @ 0                       \ find substitution, set flag
  begin
    over over >                        \ all entries tried?
  while                                \ if not, try this one
    dup (subst) -> (name) count 2r@ compare
  while                                \ if it doesn't match
    1+                                 \ try the next one
  repeat tuck > 2r> rot                \ clean up
;

: (replaces)                           ( a1 n1 a2 n2 -- )
  subst# @ #subst = SE.TOOMANY (?throw)
  (defined?)                           \ is it already defined?
  if                                   \ if so, free up the memory
    2drop dup >r (subst) -> (addr) n@ cfree SE.NOALLOC (?throw)
  else                                 \ otherwise create the substitution
    /name min rot dup >r (subst) -> (name) place 1 subst# +!
  then                                 \ allocate sufficient memory
  dup 1+ callocate SE.NOALLOC (?throw) \ store the substitution
  dup >r place r> r> (subst) -> (addr) n!
;

\ Define the string text/tlen as the text to substitute for the
\ substitution named name/nlen. If the substitution does not
\ exist it is created.                 ( text tlen name nlen --)
: replaces ['] (replaces) (error?) if 2drop 2drop then ;

\ Replace each '%' character in the input string c-addr1/len1 by
\ two '%' characters. The output is represented by caddr2/len2.
\ If you pass a string through UNESCAPE and then SUBSTITUTE,
\ you get the original string.
: unescape                             ( c-addr1 len1 c-addr2 -- c-addr2 len2)
  dup 2swap bounds
  ?do i c@ |s| = if |s| over c! 1+ then i c@ over c! 1+ loop over -
;
                                       \ split on 1st delimiter
: (split1st) >r |s| split r@ +place r> ;
                                       \ split on 2nd delimiter
: (split2nd)                           ( a1 n1 a3 -- a2 n2 a3)
  >r chop |s| split dup                \ split the string again
  if                                   \ is there a substitution?
    (defined?)                         \ is the substitution defined?
    if                                 \ if so, substitute it
      2drop (subst) -> (addr) n@ count r@ +place 1 SubstDone +!
    else                               \ if not, copy it verbatim
      "|s|" r@ +place r@ +place drop dup if "|s|" r@ +place then
    then
  else                                 \ if there is no substitution
    2drop "|s|" r@ +place              \ copy a single delimiter
  then dup if chop then r>             \ chop first char if possible
;

\ Expand the source string using substitutions.
: substitute                           ( src slen dest dlen -- dest dlen' n)
  0 SubstDone ! drop dup 0 >string
                                       \ set up for substitution
  begin                                \ split the string
    ['] (split1st) (error?) 0=
  while                                \ if no error, continue
    over                               \ if something left to process
  while                                \ split off the variable
    ['] (split2nd) (error?)
  until                                \ if no error, continue
                                       \ drop the remaining string
  nip nip count SubstErr @ if -1 else SubstDone @ then
;

: substitute.init 0 subst# ! SE.NOERROR SubstErr ! ;

: substitute.clear
  subst# @ 0 ?do i (subst) -> (addr) n@ cfree drop loop substitute.init
;

[DEFINED] 4TH# [IF]
  hide |s|
  hide "|s|"
  hide #subst
  hide /name
  hide subst#
  hide SubstDone
  hide (name)
  hide (addr)
  hide (subst)
  hide /subst
  hide (?throw)
  hide (error?)
  hide (defined?)
  hide (replaces)
  hide (split1st)
  hide (split2nd)
[THEN]
[THEN]

