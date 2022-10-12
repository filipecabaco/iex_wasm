\ Priority queue demo
\ Copyright (c) 2016 Ulrich Hoffmann

\ Released under MIT License (MIT)

include lib/anstools.4th
include lib/prio-q.4th

10 q-items 2 + array q
10 q Priority-Queue!   \ define priority queue of size 10

\ fill queue with some items
10 ( prio )  100 ( val )  q q-append
20 ( prio )  200 ( val )  q q-append
30 ( prio )  300 ( val )  q q-append

\ insert new value at appropriate position according to its priority
25 ( prio )  250 ( val ) q q!

\ display the queue
q q. cr

\ retrieve priorities and values in priority order (lowest first)
q q@  .s  ( 10 100 )
q q@  .s  ( ... 20 200 )
q q@  .s  ( ... 25 250 )
q q@  .s  ( ... 30 300 ) cr cr

depth 0 ?do drop loop

3 q-items 2 + array p
3 p Priority-Queue!   \ define priority queue of size 3

\ fetch empty priority queue
p ' q-drop catch nip ." Throws: " . cr

3 q-items 2 + array z
3 z Priority-Queue!   \ define priority queue of size 3

\ fill priority queue with more items than it can hold
1 10 z ' q-append catch  ( ok ) .s
2 20 z ' q-append catch  ( ok ) .s
3 30 z ' q-append catch  ( ok ) .s cr
4 40 z ' q-append catch  ( 4 40 q err ) nip nip nip ." Throws: " . .s cr
