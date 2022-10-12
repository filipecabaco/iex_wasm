\ 4tH - MAKEHIDE - Copyright 2011,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/strbuf.4th
include lib/row.4th
include lib/parsname.4th

8192 constant /buffer                  \ size of the string buffer
/buffer string buffer                  \ define string buffer
                                       ( c --)
: discard parse 2drop ;                \ discard tib up to the delimiter
: _\ 0 discard ;                       \ discard remainder of the line
: _( [char] ) discard ;                \ discard up to )
: _" [char] " discard ;                \ discard up to "
: _| [char] | discard ;                \ discard up to |
: >symtable parse-name buffer str-buffer! ;
: 2>symtable parse-name 2drop >symtable ; 
: .hide ."   hide " type cr ;          ( a n --)
                                       \ keywords to be recognized:
create keyword                         \ - comments and strings
  ,| ."|         ' _" ,                \ - declarations
  ,| ,"|         ' _" ,
  ,| s"|         ' _" ,
  ,| c"|         ' _" ,
  ,| abort"|     ' _" ,
  ,| throw"|     ' _" ,
  ," .|"         ' _| ,
  ," ,|"         ' _| ,
  ," s|"         ' _| ,
  ," c|"         ' _| ,
  ," ("          ' _( ,
  ," .("         ' _( ,
  ," \"          ' _\ ,
  ," :"          ' >symtable ,
  ," to"         ' >symtable ,
  ," is"         ' >symtable ,
  ," aka"        ' 2>symtable ,
  ," tag"        ' 2>symtable ,
  ," file"       ' >symtable ,
  ," enum"       ' >symtable ,
  ," array"      ' >symtable ,
  ," alias"      ' >symtable ,
  ," defer"      ' >symtable ,
  ," array"      ' >symtable ,
  ," table"      ' >symtable ,
  ," value"      ' >symtable ,
  ," +field"     ' >symtable ,
  ," field:"     ' >symtable ,
  ," cfield:"    ' >symtable ,
  ," create"     ' >symtable ,
  ," string"     ' >symtable ,
  ," offset"     ' >symtable ,
  ," buffer:"    ' >symtable ,
  ," constant"   ' >symtable ,
  ," equates"    ' >symtable ,
  ," [ignore]"   ' >symtable ,
  ," [pragma]"   ' >symtable ,
  ," variable"   ' >symtable ,
  ," +constant"  ' >symtable ,
  ," *constant"  ' >symtable ,
  ," /constant"  ' >symtable ,
  ," sconstant"  ' >symtable ,
  ," end-struct" ' >symtable ,
  NULL ,                               ( a n --)
does> 2 string-key row if cell+ @c execute else drop then 2drop ;
                                       \ dump the symbol table before exiting
: PostProcess                          ( --)
  ." [DEFINED] 4TH# [IF]" cr           \ print the header
  ' .hide buffer each-str              \ print all entries
  ." [THEN]" cr                        \ print the footer
;
                                       \ required by CONVERT.4TH
: Usage abort" Usage: makehide infile outfile" ;
: PreProcess buffer /buffer str-buffer ;
: Read-file refill ;
: Process begin parse-name dup while keyword repeat 2drop ;

include lib/convert.4th
