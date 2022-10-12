include lib/sequence.4th

[ASSERT]
{ } dup empty? . free . cr             \ empty sequence - and freed
." -----" cr
                                       \ iota sequence squared and shown
5 iota dup dup [: dup * ;] map! [: . ;] each cr
free drop                              \ and freed
assert( depth 0= )
." -----" cr
                                       \ string sequence, shown and freed
{ s" Hello" s"  world" s" !" }s dup
dup [: count type ;] each
2 nth ds.count type cr                 \ return the second element address
sfree drop
assert( depth 0= )
." -----" cr
                                       \ iota sequence reduced
5 iota dup dup 0 [: + ;] reduce! . cr  \ while "sum" does the same thing
sum . cr
free drop
assert( depth 0= )
." -----" cr
                                       \ create a sequence and
{ 9 8 7 6 5 4 3 2 1 0 } dup dup dup [: 5 < ;] find nth ? cr
3 over index nth ? cr                  \ search it both ways
free drop
assert( depth 0= )
." -----" cr

{ 9 8 7 6 5 4 3 2 1 0 } 4 set-length   \ clip a sequence
dup [: . ;] each cr                    \ show the result
free drop
assert( depth 0= )
." -----" cr

: factorial ( n -- seq n! ) iota dup 1 [: 1 + * ;] reduce! ;
9 factorial . cr
free drop
assert( depth 0= )
." -----" cr
                                       \ safely access first and last
{ 2 3 4 } dup ?first ?                 \ elements
dup ?last ?
free drop

{ } dup ?first . cr                    \ this fails and returns false
free drop
assert( depth 0= )
." -----" cr
                                       \ sequence within sequence
: seq.free dup [: free E.LIBERR throw" Cannot free sequence" ;] each free ;
                                       \ can't just FREE this one
{ { 1 2 } { 3 4 } { 5 6 } { 7 8 } } dup
[: [: . ;] each cr ;] each
seq.free drop
assert( depth 0= )
." -----" cr

5 {                                    \ CASE construct as sequence
  { [: 2 < ;] [: 2 + ;] }
  { [: 5 < ;] [: 5 + ;] }
  { [: 10 + ;] }
} cond                                 \ sequence is TOS
seq.free drop ." Returns 15: " . cr

4 {
  { [: 2 < ;] [: 2 + ;] }
  { [: 5 < ;] [: 5 + ;] }
  { [: 10 + ;] }
} cond
seq.free drop ." Returns 9: " . cr
assert( depth 0= )

