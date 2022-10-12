\ 4tH CSV with LF remover - Copyright 2015 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

10240 constant /mytib                  \ set up an extra large read buffer
/mytib buffer: mytib

aka refill Read-File                   \ read the file using REFILL

: Preprocess mytib /mytib source! ;    ( --)
: quote! [char] " = if 1 xor then ;    ( f c -- -f)
: cr-field? 0 parse 2dup 2>r bounds ?do i c@ quote! loop 2r> type dup ;
: Process 0 begin cr-field? while space Read-File 0= until drop cr ;
: Usage abort" Usage: csvnolf <infile> <outfile>" ;

include lib/convert.4th
