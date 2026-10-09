# Python: the standard REPL.
FROM i386/alpine:3.24.2

RUN apk add --no-cache python3 && \
    printf '%s\n' \
      'print("Python in the browser: CPython on 32-bit Linux, emulated in this tab. Try: import this")' \
      > /root/.pythonstartup.py

ENV LANG=C.UTF-8 PYTHONSTARTUP=/root/.pythonstartup.py
WORKDIR /root
CMD ["python3"]

LABEL snowglobe.title="Python in the browser" \
      snowglobe.ready=">>> " \
      snowglobe.exercise='["sum(x * x for x in range(10))", "import json, re, collections; collections.Counter(\"mississippi\")", "import datetime; datetime.datetime.now().isoformat()", "import sqlite3; sqlite3.connect(\":memory:\").execute(\"select sqlite_version()\").fetchone()", "import asyncio; asyncio.run(asyncio.sleep(0))", "import statistics, random; statistics.mean(random.random() for _ in range(100))", "import hashlib; hashlib.sha256(b\"hi\").hexdigest()"]'
