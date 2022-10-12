include lib/stester.4th
include lib/substit.4th
include lib/compare.4th

substitute.init

30 CHARS BUFFER: subbuff                        \ Destination buffer

\  Deﬁne a few string constants
:  "hi" S" hi" ;
:  "wld" S" wld" ;
:  "hello" S" hello" ;
:  "world" S" world" ;
\  Deﬁne a few test strings
:  sub1 S" Start: %hi%,%wld%! :End" ;           \ Original string
:  sub2 S" Start: hello,world! :End" ;          \ First target string
:  sub3 S" Start: world,hello! :End" ;          \ Second target string
\ Deﬁne the hi and wld substitutions
T{ "hello" "hi" REPLACES =>               }T    \ Replace "%hi%" with "hello"
T{ "world" "wld" REPLACES =>              }T    \ Replace "%wld%" with "world"
\ "%hi%,%wld%" changed to "hello,world"
T{ sub1 subbuff 30 SUBSTITUTE ROT ROT sub2 COMPARE => 2 0 }T
\ Change the hi and wld substitutions
T{ "world" "hi" REPLACES =>               }T
T{ "hello" "wld" REPLACES =>              }T
\ Now "%hi%,%wld%" should be changed to "world,hello"
T{ sub1 subbuff 30 SUBSTITUTE ROT ROT sub3 COMPARE => 2 0 }T
\ Where the subsitution name is not deﬁned
: sub4 S" aaa%bbb%ccc" ;
T{ sub4 subbuff 30 SUBSTITUTE ROT ROT sub4 COMPARE => 0 0 }T
\ Finally the % character itself
: sub5 S" aaa%%bbb" ;
: sub6 S" aaa%bbb" ;
T{ sub5 subbuff 30 SUBSTITUTE ROT ROT sub6 COMPARE => 0 0 }T
