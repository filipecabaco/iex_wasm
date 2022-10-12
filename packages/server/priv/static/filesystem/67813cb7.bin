\ XLS serial date is the number of days since 0 January 1900. Valid range
\ is 1900-3-1 to 2079-6-5. XLS serial date may be stored as a 16-bit
\ unsigned number.

[UNDEFINED] date>xls [IF]
365 4 * 1+ constant d/y

create @mth -1 , 0 , 31 , 59 , 90 , 120 , 151 , 181 , 212 ,
            243 , 273 , 304 , 334 , 367 , does> swap cells + @c ;

: DATE>XLS ( d m y -- mjd ) 1900 - >r @mth 58 over < if r@
  3 and 0<> 1- - then + r> d/y * 4 /mod swap 0= 1- - + ;

: XLS>DATE ( mjd -- d m y ) 1- 4 * d/y /mod 1900 + swap 4 /mod
  1+ dup rot 0= if dup 61 < 1- + swap dup 60 < 1- + then
  1 begin 1+ over over @mth > 0= until 1- nip tuck @mth - swap rot ;

[DEFINED] 4TH# [IF]
  hide d/y
  hide @mth
[THEN]
[THEN]
