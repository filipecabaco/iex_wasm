\ loan.4th

\ Loan calculator -- calculates monthly payment to pay off a loan with
\   a fixed interest rate for a fixed number of years.

\ This program is useful for calculating payments for fixed interest 
\ mortgage loans (not including taxes and insurance). User can adjust 
\ the loan amount, number of years, and interest rate to calculate 
\ "what if?" scenarios.

\ Copyright (c) 2002 Krishna Myneni
\ May be distributed in accordance with the GNU General Public License

\ ---------------------------------------

variable interest_rate	6500 interest_rate !	\ annual rate of 6.5%
variable months		180 months !
variable amount		100000 amount !

\ ---------------------------------------

include lib/anscore.4th
include lib/mixed.4th
include lib/enter.4th

variable principal
variable interest
variable balance

: month_interest ( -- n | calculate monthly interest on balance )
	balance @ u>d interest_rate @ 1200000 m*/ d>u ;

\ Calculate number of months required to payoff loan with monthly payment of n
	
: months_payoff ( n -- m )
	amount @ balance !
	dup month_interest <= if drop -1 exit then  \ will never payoff
	0
	begin
	  month_interest balance +!		\ accrue interest
	  over negate balance +!   		\ apply payment
	  1+           				\ next month
	  \ dup 4 .r 2 spaces balance @ 6 .r cr 
	  balance @ 0 <=			\ are we paid off?
	until
	1- swap drop ;

4 array last_monthlys

: ?converged ( payment nmonths -- flag | have values been seen before )
	2dup last_monthlys 2@ d= -rot
	last_monthlys 2 cells + 2@ d= or ; 

: update_last ( payment nmonths -- )
	last_monthlys 2 cells + 2@ last_monthlys 2!
	last_monthlys 2 cells + 2! ;
	
: monthly_payment ( -- n | determine the monthly payment )
	amount @ months @ / dup 40 * 100 / +  ( order of mag estimate )
	begin
	  dup months_payoff
	  dup -1 = 
	while
	  drop dup 10 / +
	repeat

	\ ( -- payment nmonths )

	0 0 update_last 0 0 update_last

	begin
	  months @ - dup
	while
	  0> if 1+ else 1- then  
	  dup months_payoff
	  2dup ?converged if drop exit then
	  2dup update_last
	repeat
	drop ;

: loan ( -- )
	." Enter whole numbers only (no decimal):" cr cr
	." Amount of loan:       " 		enter  amount !  
	." Number of years:      " 		enter  12 * months ! 
	." Yearly interest rate (% x 1000): "	enter  interest_rate ! 
	cr
	monthly_payment
	." Your monthly payment is about " .
	."  (excluding taxes and insurance)." cr	
;

loan