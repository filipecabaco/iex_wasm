include lib/fp3.4th
include lib/asinacos.4th

: asin
  17 -16 do
    i s>f f2/ f2/ f2/ f2/ fdup f. 9 dup emit emit fasin f. cr
  loop
;

: acos
  17 -16 do
    i s>f f2/ f2/ f2/ f2/ fdup f. 9 dup emit emit facos f. cr
  loop
;

: atan
  33 -32 do
    i s>f f2/ f2/ f2/ f2/ fdup f. 9 dup emit emit fatan f. cr
  loop
;

fclear 100 set-precision

asin cr
acos cr
atan cr depth . f.s