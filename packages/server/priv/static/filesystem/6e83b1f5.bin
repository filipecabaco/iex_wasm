include lib/substit.4th

substitute.init

256 string tb    \ -- addr
\ Buffer for text.
256 string db    \ -- addr
\ destination buffer for text.

: >tb           \ caddr len -- caddr' len
\ Place string in TB, and return the string. Done
\ this way to avoid problems with transient regions.
  tb place tb count
;

: .sub          \ caddr len n --
\ Display the result of a substitution.
  cr . ." Substitutions, result(" type ." )"
;

: tsub          \ caddr len --
\ Run the substitution text and display the results.
  db 256 substitute .sub
;

s" hello" >tb s" hl" replaces
s" world" >tb s" wld" replaces

s" Start: %hl%,%wld%! :End" tsub
s" Hello, world!" tsub
s" aaa%foobar%bbb" tsub
s" aaa%%bbb" tsub
s" aaa%aaa" tsub
s" aaa%" tsub
s" %aaa" tsub
s" %aaa%" tsub

substitute.clear