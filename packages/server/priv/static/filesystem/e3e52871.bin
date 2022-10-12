;;;
;;; sxml.to-html - SXML->HTML translator
;;;
;;;   This file is mechanically translated for Gauche from
;;;   Oleg Kiselyov's SXML->HTML.scm.
;;;   Public domain.
;;;

(define-module sxml.to-html
  (use text.parse)
  (use sxml.adaptor)
  (use sxml.tree-trans)
  (export SXML->HTML))
(select-module sxml.to-html)

;; NB: this is included only for backward compatibility.
;; Use of sxml.tools is strongly recommended.

;;; Generated from "SXML-to-HTML.scm"
(define (SXML->HTML tree) (SRV:send-reply (pre-post-order tree `((|@| ((*default* unquote (lambda (attr-key . value) (enattr attr-key value)))) unquote (lambda (trigger . value) (cons '|@| value))) (*default* unquote (lambda (tag . elems) (entag tag elems))) (*text* unquote (lambda (trigger str) (if (string? str) (string->goodHTML str) str))) (html:begin unquote (lambda (tag title . elems) (list "Content-type: text/html" nl nl "<HTML><HEAD><TITLE>" title "</TITLE></HEAD>" elems "</HTML>")))))))
(define (entag tag elems) (if (and (pair? elems) (pair? (car elems)) (eq? '|@| (caar elems))) (list #\newline #\< tag (cdar elems) #\> (and (pair? (cdr elems)) (list (cdr elems) "</" tag #\>))) (list #\newline #\< tag #\> (and (pair? elems) (list elems "</" tag #\>)))))
(define (enattr attr-key value) (if (null? value) (list #\space attr-key) (list #\space attr-key "=\"" value #\")))
(define string->goodHTML (make-char-quotator '((#\< . "&lt;") (#\> . "&gt;") (#\& . "&amp;") (#\" . "&quot;"))))

;; Local variables:
;; mode: scheme
;; end:
