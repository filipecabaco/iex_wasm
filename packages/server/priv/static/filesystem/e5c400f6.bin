\ Portable threaded code with trampoline                uho 2015-11-21
\ 3+4/2015 Forth–Magazin Vierte Dimension

\ https://en.wikipedia.org/wiki/Trampoline_%28computing%29

include lib/anstools.4th

: trampoline ( i * x xt -- j * x )    begin execute dup 0= until drop ;
:token NEXT ( i * x addr1 -- i * x addr2 xt )  .s dup cell+ swap @c ;
: run ( i * x -- j * x )  NEXT trampoline drop ;

0 Constant READY

: dupp ( x addr -- x x addr xt )       over swap NEXT ;
: dropp ( x addr -- addr xt )          nip NEXT ;
: show ( x addr -- addr xt )           swap ." -> " . NEXT ;
: dec    ( x1 addr -- x2 addr xt )     swap 1 - swap NEXT ;
: zeq    ( x addr -- f addr xt )       swap 0= swap NEXT ;
: ?jump ( x addr1 -- x addr2 xt )      swap IF cell+ ELSE @c THEN NEXT ;

\ : countdown ( n -- ) BEGIN dup . 1- dup 0= UNTIL drop ;
Create countdown
     ' dupp , ' show , ' dec ,
     ' dupp , ' zeq , ' ?jump , countdown ,
     ' dropp , READY ,

3 countdown run
