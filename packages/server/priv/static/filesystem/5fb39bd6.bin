\ ========================================
\ 4tH equivalent of this 'Python' horror :
\ http://www.linuxjournal.com/article/8794
\ ========================================
\    1   import sys
\    2   MoreCoconuts ="Whatever"
\    3   
\    4   for Coconuts in range(5,99999):                 #A
\    5       Pile=Coconuts                               #B
\    6       try:
\    7           for dummy in range(0,5):                #C
\    8               if (Pile%5)!=1: raise MoreCoconuts  #D
\    9               Pile=(Pile-1)/5*4                   #E
\   10           if Pile%5==0:                           #F (skip G if nonzero)
\   11               print "Victory! "+`Coconuts`        #G
\   12               sys.exit()
\   13   
\   14       except MoreCoconuts:
\   15           continue

: men 5 0 do dup 5 mod 1 <> if drop 1 leave else 1- 4 * 5 / then loop ;
: coconuts 10000 5 do i men 5 mod 0= if ." Victory! " i . cr leave then loop ;
coconuts