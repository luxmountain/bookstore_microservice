from collections import defaultdict
from threading import Lock


_lock = Lock()
_counters = defaultdict(int)


def inc(name: str, value: int = 1):
    with _lock:
        _counters[name] += value


def snapshot():
    with _lock:
        return dict(_counters)
