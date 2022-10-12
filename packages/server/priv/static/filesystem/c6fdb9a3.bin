\ Donated to the public domain, J.L. Bezemer 2014
\ My response to Joel's article "Can Your Programming Language Do This?"
\ http://www.joelonsoftware.com/items/2006/08/01.html
                                       ( y1 y2 yn n x xt1 xt2 -- x)
: reduce >r over r> execute rot 0 ?do >r r@ execute r> loop drop ;
: sum  [: dup >r +! r> ;] [: 0 swap ! ;] reduce ;
: join [: >r r@ +place r> ;] [: 0 dup rot place ;] reduce ;

variable  A                            \ sorry, we rather don't do locals
64 string B                            \ neither strings nor integers

12 34 45 3 A sum ? cr                  \ call both "functions"
s" End" s" The" s" Is" s" This" 4 B join count type cr