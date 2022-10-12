include lib/hash.4th
include lib/hashbuck.4th
include lib/userpad.4th

15 /bucket 2 * * 1+ constant /myhash
/myhash array myhash

: sput >r 2>r >pad drop 2r> r> put ;
: sget get error? abort" Bad bucket" count ;

myhash /myhash hashtable
' sdbm is hash

s" This is my life" s" alpha" myhash sput
s" This is the end" s" beta"  myhash sput
s" So this is Xmas" s" gamma" myhash sput
s" So this is love" s" delta" myhash sput

s" alpha"   myhash sget type cr
s" beta"    myhash sget type cr
s" gamma"   myhash sget type cr
s" delta"   myhash sget type cr
s" epsilon" myhash sget type cr