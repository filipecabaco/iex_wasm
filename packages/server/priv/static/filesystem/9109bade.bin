\ Copyright 2003 Roelf, postbus@bmbcon2.demon.nl

\ Assuming the list is made of nodes and each node is composed of two cells.
\ Cell 1 contains pointer to another node, the link.
\ Cell 2 points to another list, literal data, structure, xt, whatever.

\ There are many ways to create these lists, here we use a free list from
\ which we'll construct new lists.

\ note on stack comments:
\ node = address node-structure
\ list = address first node-structure in list aka chain of nodes

\  Allocate LISP cells

[UNDEFINED] New-List [IF]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th [THEN]
[UNDEFINED] #Nodes   [IF]
    512 constant #Nodes                \ dividable by '2 cells'
[THEN]
                                       \ nodes will be cons from here
2 cells constant Node                  \ a list node has '2 cells' a.units
#Nodes Node * array List-Heap          \ 8 bytes, sorry: a.units, per cell
       Node   array Nil                \ create zero node

variable Free-List                     \ free list handle

: Zero-Heap
        Nil dup 2dup ! cell+ !         \ zero NIL node
        List-Heap #Nodes Node * bounds do 0 i ! loop ;

: Init-Free-List  ( --)  
        Zero-Heap
        List-Heap
        #Nodes 1- 0                    \ all nodes except the last
        do                             \ will be linked
          dup Node + dup >r swap ! r>
        loop
        Nil swap !                     \ last is linked to Nil node
        List-Heap Free-List !          \ Free-List contains whole heap
;

\ Some words to deal with the list, some have LISP names

\ retrieves what is in the first node's 'pointer cell'
: CAR  ( list - x )
        cell+ @  ;

\ return next node i.e. rest of list
\ : CDR  ( list - restlist)
\        @  ;
aka @ CDR

\ add node to the beginning of the list and return 'newlist'
: add-node ( node list - newlist )
        over ! ;

\ remove first node, returning node and 'newlist'
: remove-node   ( list - node restlist )
        dup Nil = E.LIBERR throw" Empty list" dup CDR ;

\ get us a node from the heap
: get-node      ( - node )
        Free-List @ remove-node Free-List ! ;

\ return node to the heap
: return-node   ( node - )
        Free-List @ add-node Free-List ! ;

\ creating a new list with Nil as first node
\ : New-List      (  - list )
\        Nil ;
aka Nil New-List

\ add item to a list returning the newlist
: CONS  ( whatever list - newlist)
        get-node
        tuck ! tuck cell+ ! ;

\ show what is in list
: Show-List     ( list - )
        begin dup Nil <>
        while dup CAR . cr CDR
        repeat
        drop ." NIL" cr ;

Init-Free-List

[DEFINED] 4TH# [IF]
  hide Node
  hide List-Heap
  hide Free-List
  hide Zero-Heap
  hide Init-Free-List
[THEN]

\ example:
\ New-List value my-list
\ my-list Show-List
\ s" postbus@bmbcon2.demon.nl"
\ my-list CONS to my-list
\ my-list CONS to my-list
\ my-list Show-List
\ my-list dup CAR swap CDR CAR type

\ Roelf, generated Wed Jul 23 02:53:42 2003
[THEN]

