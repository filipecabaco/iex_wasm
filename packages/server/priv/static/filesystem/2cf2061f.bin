\ Filename     : pagerank.4th
\ Description  : Google PageRank Checksum Algorithm
\ C author     : http://zhiwei.li/
\ C version    : 2008-08-20
\ 4tH author   : J.L. Bezemer
\ 4tH version  : 2008-11-18

: ConvertStrToInt                      ( a n1 n2 n3 -- n4)
  swap 2swap bounds ?do over * i c@ + loop nip
;

[hex]
: HashURL                              ( a n1 -- n2)
  2dup 01505 021 ConvertStrToInt 02 rshift >r
  00 01003f ConvertStrToInt
  r@ 04 rshift 03ffffc0 and r> 03f and or >r
  r@ 04 rshift 03ffc00 and r> 03ff and or >r
  r@ 04 rshift 03c000 and r> 03fff and or >r

  r@ 03c0 and 04 lshift
  r@ 03c and or
  02 lshift over 0f0f and or swap

  r@ -04000 and 04 lshift
  r> 03c00 and or
  0a lshift swap 0f0f0000 and or or
;
[decimal]

: CheckHash                            ( n -- c)
  false 0 >r >r
  begin
    10 /mod swap r@
    if 2* 10 /mod + then
    r> 0= r> rot + >r >r
    dup 0=
  until

  drop r> r>
  10 mod dup 0<>
  if 10 swap - over
     if dup 2 mod 1 =
        if 9 + then
        1 rshift
     then
  then
  48 + nip
;

s" http://www.xs4all.nl" .( Checksum=) HashURL dup CheckHash
char 7 emit emit . cr