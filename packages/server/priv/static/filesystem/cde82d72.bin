\ Taken from http://www.forthfreak.net
\ Converted for ZENfloat by Hans Bezemer, 2010

[UNDEFINED] polar>xy [IF]
[UNDEFINED] fsin     [IF] include lib/zenfsin.4th  [THEN]
[UNDEFINED] fround   [IF] include lib/zenround.4th [THEN]
: abscissa fcos f* ;                   ( r phi -- x )
: ordinate fsin f* ;                   ( r phi -- y )
: polar>xy 2over 2over ordinate fround f>s >r abscissa fround f>s r> ;
[THEN]                                 ( r rad -- x y )