\ 4tH library - BLOCK (multiple buffers) - Copyright 2013,2020 J.L. Bezemer
\ You can redistribute this file and/or modify it under
\ the terms of the GNU General Public License

[UNDEFINED] block    [IF]
[UNDEFINED] bsearch  [IF] include lib/bsearch.4th  [THEN]
[UNDEFINED] e.ioerr  [IF] include lib/throw.4th    [THEN]
[UNDEFINED] highbit  [IF] include lib/constant.4th [THEN]
[UNDEFINED] E.LIBERR [IF] include lib/throw.4th    [THEN]
[UNDEFINED] #blocks  [IF] 16 constant #blocks      [THEN]

         64 constant c/l               \ characters per line
         16 constant l/scr             \ lines per editing screen
c/l l/scr * constant b/buf             \ size of an editing screen

256 string block-file                  \ name of block file

struct                                 \ block index element
  field: block#                        \ consists of a block number
  field: buffer#                       \ and a buffer number
end-struct /blk_idx                    \ size of block index element
                                       \ the block buffers themselves
#blocks b/buf * 1+ buffer: (buffers) does> swap b/buf * + ;
#blocks /blk_idx * array (blk_index)   \ the block index address / runtime
aka (blk_index) (blk_idx) does> swap /blk_idx * + ;
#blocks array (buf_idx) does> swap cells + ;
                                       \ the buffer index (reverse index)
variable saturated                     \ are the buffers saturated?
variable free-buf#                     \ next block-buffer to use
variable scr                           \ 7.6.2.2190
variable blk                           \ current block
variable buf                           \ current buffer
variable ichan                         \ saving input device in use
variable ochan                         \ saving output device in use

: chans> cin ichan ! cout ochan ! ;    ( --)
: >chans ichan @ use ochan @ use ;     ( --)
: ?throw if >chans e.ioerr throw then ;
                                       \ performs i/o and returns buffer
: open-block                           ( buf# blk# -- h addr b/buf)
  chans> block-file count output input + open dup error? ?throw use
  swap b/buf * dup 0< ?throw over seek ?throw swap (buffers) b/buf
;
                                       \ several other i/o routines
: close-block close >chans ;           ( h --)
: read-block open-block accept b/buf < ?throw close-block ;
: write-block open-block type close-block ;
                                       \ flush block only if dirty
: ?flush                               ( buf# blk# --)
  dup highbit and                      \ is this block dirty?
  if lowbits and over over write-block swap (buf_idx) ! else drop drop then
;                                      \ if so write it and reset dirty bit
                                       \ first external words
: update buf @ (buf_idx) dup @ highbit or swap ! ;
: empty-buffers 0 dup saturated ! free-buf# ! ;
: open-blockfile block-file place 0 #blocks (buffers) c! empty-buffers ;
: save-buffers saturated @ 0 ?do i dup (buf_idx) @ ?flush loop ;
: flush save-buffers empty-buffers ;   ( --)
                                       \ create a block file: DO ONLY ONCE!
: create-blockfile                     ( n1 a2 n2 --)
  output open error?                   \ open file and write spaces
  if drop drop else tuck use b/buf * 0 ?do bl emit loop close then
;
                                       \ searches BLK_IDX for a block
: find-blk                             ( blk# -- index flag)
  ['] b-compare defer@ >r ['] get-key defer@ >r
  [: 2dup < if 2drop -1 exit then > ;] is b-compare
  [: swap /blk_idx * + -> block# @ ;] is get-key
  (blk_index) saturated @ bsearch      \ use binary search to locate block
  r> is get-key r> is b-compare        \ save/restore execution semantics
;
                                       \ frees up a buffer and updates indexes
: free-buf                             ( buf# -- buf# blk-idx)
  dup (buf_idx) @ over over ?flush lowbits and find-blk
  if                                   \ find block, remove from block index
    >r r@ 1+ (blk_idx) r@ (blk_idx) #blocks r@ - /blk_idx * smove r>
  else                                 \ block index is corrupt
    true E.LIBERR throw" Allocated block not found"
  then
;
                                       \ generic buffer allocator
: get-buf                              ( blk# -- buf# blk# f)
  dup find-blk dup >r                  \ find the block
  if                                   \ if found, simply return its address
    (blk_idx) -> buffer# @             \ if not found, free up a buffer
  else                                 ( blk# buf# blk-idx)
    free-buf# dup @ dup 1+ #blocks mod rot !
    saturated dup @ dup 1+ #blocks min rot ! #blocks =
    if free-buf rot tuck < if 1- then else swap then
    >r r@ (blk_idx) r@ 1+ (blk_idx) saturated @ 1- r@ - /blk_idx * smove r>
    (blk_idx) >r dup r@ -> buffer# ! over r> -> block# ! over over (buf_idx) !
  then                                 \ update indexes
  dup buf ! over blk ! swap r> 0=      \ update variables, create stackframe
;
                                       \ more external words, some Forth-79
: buffer get-buf drop drop (buffers) ; ( blk# -- addr)
: block get-buf if over over read-block then drop (buffers) ;
: clear buffer b/buf blank update ;    ( blk# --)

: list                                 ( blk# --)
  base @ swap dup dup scr ! cr ." Scr # " . block decimal
  l/scr 0 do cr i 3 .r space i c/l * over + c/l type loop cr drop base !
;

aka flush close-blockfile              ( --)

[DEFINED] debug-blk [IF]
: .index-blk                           ( --)
  cr ." buf# blk# dirty?" cr saturated @ 0
  ?do i . i (buf_idx) @ dup lowbits and . highbit and 0<> . cr loop cr
  ." n blk# buf#" cr  saturated @ 0
  ?do i . i (blk_idx) -> block# ? i (blk_idx) -> buffer# ? cr loop cr
  ." blk=" blk ? ." scr=" scr ? cr     \ show indexes and external variables
;
[THEN]

[DEFINED] 4TH# [IF]
  hide c/l
  hide l/scr
  hide block-file
  hide block#
  hide buffer#
  hide /blk_idx
  hide (buffers)
  hide (blk_index)
  hide (blk_idx)
  hide (buf_idx)
  hide saturated
  hide free-buf#
  hide buf
  hide ichan
  hide ochan
  hide chans>
  hide >chans
  hide ?throw
  hide open-block
  hide close-block
  hide read-block
  hide write-block
  hide ?flush
  hide find-blk
  hide free-buf
  hide get-buf
[THEN]
[THEN]
