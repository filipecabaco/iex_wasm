\ PICTURE -- Albert Nijhof -- oct2006
\ 4tH version -- J.L. Bezemer -- dec2006,apr2014

[UNDEFINED] PICTURE [IF]
[UNDEFINED] '?'     [IF] include lib/chars.4th [THEN]

: picture                              ( n1 a1 n2 -- a3 n4 )
  swap >r >r dup abs <#                \ put string on the return stack
  begin
    r> dup                             \ all format chars done?
  while                                \ if not, decrement length
    1- dup chars r@ + c@ swap >r       \ get current character
    '#' over = if drop #  else         \ print a digit
    '?' over = if drop #s else         \ print entire number
    '+' over = if drop sign (error) swap else
    '!' over = if drop r> 1- dup chars r@ + c@ swap >r hold else
    '_' over = if drop dup if # else bl hold then
    else hold then then then then then \ if not special, HOLD char
  repeat r> drop drop                  \ get rid of the format string
  over (error) = if nip else sign then #>
;                                      \ add the sign if not issued

\ Some examples:
\ ==============
\ 12345678 S" fl. +?.##" PICTURE TYPE cr     ( fl. 123456.78)
\ 12345678 S" C#-##"     PICTURE TYPE cr     ( C6-78)
\ 12345678 S" #####"     PICTURE TYPE cr     ( 45678)
\ 12345678 S" F#.#.#.#"  PICTURE TYPE cr     ( F5.6.7.8)
\ 12345678 S" ##/##/##"  PICTURE TYPE cr     ( 34/56/78)
\ 12345678 S" ? # #"     PICTURE TYPE cr     ( 123456 7 8)
\ 12345678 S" -#+!"      PICTURE TYPE cr     ( -8+)
\ 12345678 S" ##,# km"   PICTURE TYPE cr     ( 67,8 km)
\ 12345678 S" DM +?.##"  PICTURE TYPE cr     ( DM 123456.78)
\ depth . cr
[THEN]
