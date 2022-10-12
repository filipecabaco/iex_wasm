\ Taken from http://www.forthfreak.net
\ Converted for ANSfloat by Hans Bezemer, 2010

[UNDEFINED] polar>xy [IF]
[UNDEFINED] fsin     [IF] include lib/fsinfcos.4th [THEN]
: abscissa fcos f* ;                   ( r phi -- x )
: ordinate fsin f* ;                   ( r phi -- y )
: polar>xy fover fover abscissa fround f>s ordinate fround f>s ;
[THEN]                                 ( r rad -- x y )