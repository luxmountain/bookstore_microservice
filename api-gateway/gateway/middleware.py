import time
from collections import defaultdict, deque
from threading import Lock

from django.http import JsonResponse

from .metrics import inc


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        duration_ms = int((time.perf_counter() - start) * 1000)

        inc("http_requests_total")
        inc(f"http_status_{response.status_code}")

        print(
            f"[api-gateway] method={request.method} path={request.path} "
            f"status={response.status_code} duration_ms={duration_ms}"
        )
        return response


class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.limit = 120
        self.window_seconds = 60
        self._requests = defaultdict(deque)
        self._lock = Lock()

    def __call__(self, request):
        if request.path.startswith("/api/health") or request.path.startswith("/api/metrics"):
            return self.get_response(request)

        now = time.time()
        ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "unknown")).split(",")[0].strip()

        with self._lock:
            queue = self._requests[ip]
            while queue and queue[0] <= now - self.window_seconds:
                queue.popleft()
            if len(queue) >= self.limit:
                inc("rate_limit_blocked_total")
                return JsonResponse(
                    {"error": "Rate limit exceeded", "limit": self.limit, "window_seconds": self.window_seconds},
                    status=429,
                )
            queue.append(now)

        return self.get_response(request)
