include lib/ramdisk.4th
include lib/anscore.4th
                                       \ show disk parms
: ram.free ram.du . ." byte(s) free, " . ." file(s) left" cr ;

: ram.refill                           ( array -- a2 n2)
  dup >r 2@ dup                        \ save array address, fetch values
  if over count dup 1+ >r 2swap r> /string else pad 0 2swap then r> 2!
;                                      \ if space get next string,
                                       \ adjust buffer, save it and return
1024 16 * constant /mydisk
/mydisk buffer: mydisk
2 array ram.fd
                                       \ "format" the disk
mydisk /mydisk 64 ram.format abort" Cannot format disk"
ram.free cr
                                       \ write three files
s" .( Hello world!) cr"      s" hello.4th"   ram.write abort" Cannot write file"
s" 45 63 + ."                s" test.4th"    ram.write abort" Cannot write file"
s" \ This is just a comment" s" comment.4th" ram.write abort" Cannot write file"
ram.ls cr
                                       \ delete and recreate a file
s" test.4th" ram.rm abort" Cannot delete file"
s" 63 45 + ." s" test.4th" ram.write abort" Cannot write file"
ram.ls cr
                                       \ reorganize the disk
ram.pack                               \ and check integrity visually
ram.ls cr
s" comment.4th" ram.read abort" Cannot read file" type cr
s" test.4th"    ram.read abort" Cannot read file" type cr
                                       \ append a file and write a new one
s"  cr .( End of test)" ram.append abort" Cannot append file"
s" \ This is more comment" s" more.4th" ram.write abort" Cannot write file"
ram.ls cr                              \ check integrity visually
s" test.4th"    ram.read abort" Cannot read file" type cr
                                       \ write a text file
s" This is the beginning of a text" 1+ \ compensate for delimiter
s" sequential.txt" ram.write abort" Cannot write file"
                                       \ append to the file
s" This is some more text, just to prove a point" 1+
ram.append abort" Cannot append file"
                                       \ append some more
s" And finally, this is the end of the text." 1+
ram.append abort" Cannot append file"
                                       \ now get the buffer address
s" sequential.txt" ram.read abort" Cannot read file" ram.fd 2!
                                       \ and save it
ram.fd ram.refill type cr              \ and list it quietly
ram.fd ram.refill type cr              \ line by line until
ram.fd ram.refill type cr              \ there are no more lines left
ram.fd ram.refill type cr              \ and a NULL string is returned

ram.ls cr                              \ final checkup and bye bye
ram.free