# Java: jshell on OpenJDK 11, the newest JDK Alpine still builds for 32-bit x86.
FROM i386/alpine:3.24.2

RUN apk add --no-cache openjdk11-jdk

ENV LANG=C.UTF-8 PATH=/usr/lib/jvm/default-jvm/bin:$PATH
WORKDIR /root
# --execution local keeps snippets in jshell's own JVM instead of starting a second one
CMD ["jshell", "--execution", "local", "-J-Xshare:auto", "-J-XX:TieredStopAtLevel=1"]

LABEL snowglobe.title="Java in the browser" \
      snowglobe.ready="jshell> " \
      snowglobe.memory="768" \
      snowglobe.exercise='["var xs = java.util.List.of(1, 2, 3, 4)", "xs.stream().map(x -> x * x).reduce(0, Integer::sum)", "String.join(\"-\", \"jshell\", \"in\", \"a\", \"tab\")", "java.time.LocalDate.now().plusDays(30)", "var md = java.security.MessageDigest.getInstance(\"SHA-256\")", "new java.math.BigInteger(1, md.digest(\"hi\".getBytes())).toString(16)"]'
