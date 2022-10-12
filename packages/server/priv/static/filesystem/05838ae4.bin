\ AN APPROACH TO NEW CONTROL STRUCTURES
\ Copyright 1992, M.L. Gassanenko 
\ [http://www.forth.org.ru/~mlg/ef94/ef94-2-paper.txt]

\ The implementation of backtracking may be briefly described as following:

\ 1) the residue of the caller procedure threaded code is called continuation;
\ 2) a success is a call of the continuation;
\ 3) a failure is a return from the continuation. (To perform failure a
\    procedure compiled into the continuation should exit both its threaded
\    code and the continuation threaded code).

\ To call the residue of the caller threaded code the callee may execute
\ the code SUCCESS. To perform failure, i.e. exit the code fragment
\ which called the procedure, the callee may perform the code FAIL.
\ Note that since the top return stack item contains the address of
\ continuation, exiting to this address is scarcely meaningful.

\ For example:

\ : 1-10
\    1
\    BEGIN
\          DUP SUCCESS
\          1+
\          DUP 11 =
\    UNTIL
\    DROP FAIL
\ [FORCE] ;

\ : X 1-10 . ;

\ Execution of the word X will print numbers from 1 to 10.

\ The technique described above cannot work if we use the return stack to hold
\ temporary data!!

[UNDEFINED] SUCCESS [IF]
: SUCCESS R> R@ SWAP >R >R ;           \ remember that ; compiles EXIT
: FAIL R> R> DROP >R ;
[THEN]
