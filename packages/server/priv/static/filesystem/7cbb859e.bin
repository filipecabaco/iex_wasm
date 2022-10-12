\ Quotations test by Marcel Hendrix, 2012-07-14
\ Believed to be in the Public Domain

include lib/fp1.4th

FLOAT ARRAY PI

314159265 -8 PI F!

: test
        [: F* F* ;] >R
        [: F- F- ;] >R
        [: F+ F+ ;] >R
        11 s>f 2 s>f 3 s>f R> EXECUTE  F.
        11 s>f 2 s>f 3 s>f R> EXECUTE  F.
        11 s>f 2 s>f 3 s>f R> EXECUTE  F.

        PI F@ F. ;

defer do-this defer do-that : generic do-this do-that ;

: mode-1 [: ." x"     ;] is do-this [: ." y"     ;] is do-that ;
: mode-2 [: ." this " ;] is do-this [: ." that " ;] is do-that ;

: .ABOUT CR ." Try: test           -- Prints `16.000000 12.000000 66.000000 3.141593`"
         CR ."      mode-1 generic -- Prints `xy`"
         CR ."      mode-2 generic -- Prints `this that`" ;

.about cr test cr
mode-1 generic cr
mode-2 generic cr