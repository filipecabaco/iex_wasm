\ 4tH Top rank per group - Copyright 2014 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

\ Find the top N salaries in each department,
\ where N is provided as a parameter

include lib/shelsort.4th               \ for SORT
include lib/compare.4th                \ for COMPARE

4 constant #fields                     \ number of fields

2 +constant .salary                    \ offsets to the fields
3 +constant .dept                      \ in the employees table

create employees                       \ create the table
\ Employee Name,Employee ID,Salary,Department
  ," Tyler Bennett"   ," E10297" 32000 , ," D101"
  ," John Rappl"      ," E21437" 47000 , ," D050"
  ," George Woltman"  ," E00127" 53500 , ," D101"
  ," Adam Smith"      ," E63535" 18000 , ," D202"
  ," Claire Buckman"  ," E39876" 27800 , ," D202"
  ," David McClellan" ," E04242" 41500 , ," D101"
  ," Rich Holcomb"    ," E01234" 49500 , ," D202"
  ," Nathan Adams"    ," E41298" 21900 , ," D050"
  ," Richard Potter"  ," E43128" 15900 , ," D101"
  ," David Motsinger" ," E27002" 19250 , ," D202"
  ," Tim Sampair"     ," E03033" 27000 , ," D101"
  ," Kim Arlich"      ," E10001" 57000 , ," D190"
  ," Timothy Grove"   ," E16398" 29900 , ," D190"
  here employees - #fields / constant #emp
                                       \ calculate the number of employees
#emp array emp-idx                     \ create an index
                                       \ sort on department, salary
:noname                                ( x1 x2 -- f)
  over over >r .dept @c count r> .dept @c count compare dup
  if nip nip 0< else drop >r .salary @c r> .salary @c > then
; is precedes
                                       ( x n --)
: init-idx tuck 0 do employees i #fields * + over i th ! loop swap sort ;
                                       \ display the salaries in a department
: .salaries                            ( n x1 x2 -- n)
  over - rot dup >r min over @ .dept @c count type space
  bounds ?do i @ .salary @c . loop cr r>
;                                      \ no more than first n entries
                                       \ show the top n salaries/department
: top-salaries                         ( n --)
  emp-idx #emp 0 ?do                   \ go sequentially through index
    dup @ .dept @c count emp-idx i th @ .dept @c count compare
    if emp-idx i th dup >r .salaries r> then
  loop emp-idx #emp th .salaries drop  \ show salaries on department switch
;

emp-idx #emp init-idx                  \ first create the index

3 top-salaries cr                      \ first 2 salaries
1 top-salaries cr                      \ first salary
200 top-salaries cr                    \ first 200 salaries
