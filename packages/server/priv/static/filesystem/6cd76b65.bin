\ Record handling demonstration (c) 2005,2012 J.L Bezemer

\ file handle
file records

\ define structure Address
struct
  64 chars +field Street
  32 chars +field City
end-struct /Address

\ extend structure Address to Person
/Address
  32 chars +field Name
  12 chars +field Age
end-struct /Person

\ define record
16 constant #Persons                   \ number of persons in array
/Person #Persons * constant /Persons   \ total size of array in bytes
/Persons string Persons                \ instanciate structure
 Persons constant 'Persons             \ copy address

\ make Persons addressable
:redo Persons swap /Person * + ;

\ Show a field
: ShowField type count type cr ;

\ print contents of the record
: ShowPerson                           ( --)
  >r cr
  r@ Persons -> Name    s" Name   : " ShowField
  r@ Persons -> Street  s" Street : " ShowField
  r@ Persons -> City    s" City   : " ShowField
  r@ Persons -> Age     s" Age    : " ShowField
  cr r> drop
;

\ open a file
: OpenFile                             ( m --)
   s" records.dbf" rot open error?     ( h f)
   abort" Cannot open file!"           \ exit on error   
   dup to records                      ( h h)
   use                                 ( --)
;

\ Initialize a field
: InitField Persons + place ;

\ initialize fields
0 >r                                   \ save index
s" Hans Bezemer"    r@ Persons -> Name   place
s" Lagendijk 79"    r@ Persons -> Street place
  s" Den Helder"    r@ Persons -> City   place
          s" 36"    r@ Persons -> Age    place

r> 1+ >r                               \ increment index
 s" Linus Torvalds" r@ Persons -> Name   place
s" 201 Rodeo Drive" r@ Persons -> Street place
      s" San Diego" r@ Persons -> City   place
             s" 36" r@ Persons -> Age    place
r> drop                                \ drop index

0 ShowPerson                           \ show the data
1 ShowPerson

." Writing file.." cr
output OpenFile                        \ open the outputfile
'Persons /Persons type                 \ save data
records close                          \ close file

." Erasing data.." cr
'Persons /Persons blank                \ erase buffer

." Reading file.." cr
input OpenFile                         \ open the inputfile
'Persons /Persons accept               \ read data
records close                          \ close file

/Persons =                             \ if no IO errors
if
   0 ShowPerson                        \ show the data
   1 ShowPerson
else
   ." Reading error!" cr               \ else message
then
