# Runs when the REPL starts: Rich renders every result, traceback and inspect() call.
from rich import pretty, traceback, inspect, print
from rich.console import Console
from rich.markup import escape
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.syntax import Syntax
from rich.tree import Tree

pretty.install()
traceback.install()
console = Console()

_examples = [
    "print('[bold magenta]hello[/] from [green]Rich[/] :sparkles:')",
    "t = Table('language', 'year'); t.add_row('Python', '1991'); t.add_row('Elixir', '2012'); t",
    "Syntax('def fib(n):\\n    return n if n < 2 else fib(n-1) + fib(n-2)', 'python')",
    "inspect(str.split)",
    "{'nested': {'data': [1, 2, 3], 'pretty': True}}",
]
console.print(Panel.fit(
    Text.from_markup(
        "[bold]Python + Rich[/]: CPython 3.14 on 32-bit Linux, emulated in this tab.\n\nTry:\n"
        + "\n".join(f"  [cyan]{escape(e)}[/]" for e in _examples),
        # show the examples' :sparkles: as typed, not as an emoji
        emoji=False,
    ),
    border_style="blue",
))
del _examples
