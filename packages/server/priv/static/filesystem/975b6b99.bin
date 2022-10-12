\ 4tH fgrep utility - Copyright 2003, 2004 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[needs lib/search.4th]
[needs lib/argopen.4th]
                                       \ process the input file line by line
: ProcessFile                          ( n --) 
  begin
    1+ refill                          \ increase linenumber and read the line
  while                                \ save linenumber
    >r 0 parse 2dup 1 args search      \ parse the line and get the pattern
    nip nip                            \ if found display
    if r@ 5 .r [char] : emit space type cr
    else 2drop                         \ if not, drop
    then r>                            \ return the linenumber
  repeat drop                          \ drop the linenumber
;

: fGrep                                \ open input and output files
  argn 3 < abort" fgrep pattern file"  \ issue message if error
  argn 2 do
    input i arg-open                   \ open the input file
    ." >>> " i args type cr            \ show the filename
    0 ProcessFile                      \ process the file
    close                              \ close the file
  loop
;

fGrep
