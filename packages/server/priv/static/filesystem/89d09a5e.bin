\ http://www.tempest-sw.com/benchmark/
\ Direct port from the C code
\ Direct port from Reva 9.x

include lib/ansmem.4th
include lib/ncoding.4th

variable pi
variable numdigits
variable alength
variable a
variable pilength 
variable nines 
variable predigit
variable Q
variable P

: computepi 
	\ allocate work area:
	numdigits @ 10 3 */ dup alength ! nells allocate abort" Allocation failed" dup a !
	\ initialize work area to '2'
	alength @ 0 do 2 over n! nell+ loop drop
	\ main loop
	numdigits @ 0 do
		0 Q !
        \ int p = 2 * alength - 1;
		alength @ 2* 1- P !
		\ downto loop:
		-1 alength @ 1- do
			\ x = 10*a[i] + q*(i+1)
			i dup 1+ \ i i+1
			Q @ * swap \ q*(i+1) i
			nells a @ + dup >r n@ \ q*(i+1) a[i]
			10 * + \ x ( r:a+i)
			\ a[i] = x%p
			dup P @ mod \ x x*p
			r> n!  \ a[i] = x*p
			\ q = x / p
			P @ / Q !
			\ p -= 2
			-2 P +!
		-1 +loop

		\ a[0] = q % 10
		\ q /= 10
		Q @ 10 /mod Q ! a @ n!
		Q @ 9 = if 
			1 nines +! 
		else
			Q @ 10 = if
\				pi[piLength] = (char) (predigit + 1 + '0');
				predigit @ 1+ [char] 0 + pi @ pilength @ + c!
\				for (k = 1; k <= nines; ++k)
\					pi[piLength+k] = '0';
				nines @ 1+ 1 do
					[char] 0 pi @ pilength @ + i + c!
				loop
\			predigit = 0;
				0 predigit !
			else
\				pi[piLength] = (char)(predigit + '0');
				predigit @ [char] 0 + pi @ pilength @ + c!
\				predigit = q;
				Q @ predigit !
\				for (k = 1; k <= nines; ++k)
\					pi[piLength + k] = '9';
				nines @ 1+ 1 do
					[char] 9 pi @ pilength @ i + + c!
				loop
			then
\			piLength += nines + 1;
			nines @ 1+ pilength +!
\			nines = 0;
			0 nines !
		then
	loop
    \ pi[piLength] = (char)(predigit + '0');
	predigit @ [char] 0 + 
	pilength @ pi @ + c!
	;
: setup
	argn 2 <> abort" usage: pi #DIGITS"
	1 args number dup 0> 0= abort" #DIGITS must be a number!"
	dup numdigits !
	1+ allocate abort" Allocation failed" pi !
	;
: printpi pi @ numdigits @ type cr ;
: cleanup pi @ free a @ free ;
setup computepi printpi cleanup
