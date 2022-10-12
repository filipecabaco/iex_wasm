include lib/toolfile.4th

struct
  16 +field firstname
  32 +field lastname
  16 +field telephone
end-struct /person

/person buffer: person

s" Hans" person -> firstname place
s" Bezemer" person -> lastname place
s" 06,55174598" person -> telephone place

person /person s" persons.bin" spit abort" Cannot write file"
person /person erase

s" Agnes" person -> firstname place
s" Megharba" person -> lastname place
s" 035,2190756" person -> telephone place

person /person s" persons.bin" +spit abort" Cannot append file"
person /person erase

person /person s" persons.bin" slurp abort" Cannot read file"
. ." chars read at address " . cr

person -> firstname count type cr
person -> lastname count type cr
person -> telephone count type cr cr

person /person erase

s" Jochen" person -> firstname place
s" Maassen" person -> lastname place
s" 02160,611816" person -> telephone place

person /person s" persons.bin" /person spit! abort" Cannot rewrite file"
person /person erase

person /person s" persons.bin" /person slurp@ abort" Cannot reread file"
. ." chars read at address " . cr

person -> firstname count type cr
person -> lastname count type cr
person -> telephone count type cr cr depth .

