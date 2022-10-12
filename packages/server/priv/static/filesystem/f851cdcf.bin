\ 4tH deTABber - Copyright 2010,2012 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

include lib/tabs.4th

   8 constant /tab 
1024 constant /ltib

       /ltib string ltib
/ltib /tab * string buf

: usage abort" Usage: detab infile outfile" ;
: read-file refill ;
: preprocess ltib /ltib source! ;
: process buf >r 0 parse tuck r@ place r> swap /tab detab -trailing type cr ;

include lib/convert.4th