\ (c) Copyright 1994 Gordon R Charlton.  Permission is granted by
\ the author to use this software for any application provided this
\ copyright notice is preserved.

include lib/crc.4th

\ Testing...
: s1 ( --addr n)  s" An Arbitrary String" ;
: s2 ( --addr n)  s" ZYXWVUTSRQPONMLKJIHGFEDBCA" ;

CR
.( 16 Bit Cyclic Redundancy Checksums. Version FSL1.0  29th October 1994) CR
.(             Gordon Charlton - gordon@charlton.demon.co.uk) CR
CR

.( >xmodem ...) CR
s1 TYPE .(         gives ) s1 >xmodem  .  .( Should be DDFC) CR
s2 TYPE .(  gives )        s2 >xmodem  .  .( Should be B199) CR
CR

.( >x.25 ...) CR
s1 TYPE .(         gives ) s1 >x.25  .  .( Should be 2364) CR
s2 TYPE .(  gives )        s2 >x.25  .  .( Should be 1436) CR
CR

.( >crc-ccitt ...)      CR
s1 TYPE .(         gives ) s1 >crc-ccitt  .  .( Should be A5A9) CR
s2 TYPE .(  gives )        s2 >crc-ccitt  .  .( Should be 663A) CR
CR
