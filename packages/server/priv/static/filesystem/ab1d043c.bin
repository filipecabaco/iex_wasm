\ Taken from http://rosettacode.org
\ 4tH version 2013, Hans Bezemer

include lib/md5.4th

\ Create a MD5 variable md1 in the dictionary

/md5 buffer: md1 latest md5-init

\ Update the variable with data

s" The quick brown fox jumped over the lazy dog's back" md1 md5-update

\ Finish the MD5 calculation resulting in four unsigned 32 bit words
\ on the stack representing the hash value

md1 md5-finish

\ Convert the hash value to a hex string and print it

." E38CA1D920C4B8B8D3946B2C72F01680" cr
md5+to-string type cr

\ md1 md5-dump depth .
