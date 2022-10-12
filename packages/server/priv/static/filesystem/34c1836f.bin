;; generated automatically.  DO NOT EDIT
#!no-fold-case
(define-module gauche.collection (export call-with-iterator with-iterator call-with-iterators call-with-builder with-builder fold fold2 fold3 map map-to map-accum for-each fold$ fold2$ fold3$ map$ for-each$ find find-min find-max find-min&max filter filter-to remove remove-to partition partition-to size-of lazy-size-of coerce-to group-collection))
(select-module gauche.collection)
(dynamic-load "gauche--collection")
(define-syntax with-iterator (syntax-rules () ((_ (coll end? next . opts) . body) (call-with-iterator coll (^ (end? next) . body) . opts))))
(define-syntax with-builder (syntax-rules () ((_ (class add! get . opts) . body) (call-with-builder class (^ (add! get) . body) . opts))))
