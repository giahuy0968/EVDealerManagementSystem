package com.evdms.authservice.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {
    private static class Bucket {
        int count;
        long resetAt;
    }

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // 5 requests per 15 minutes
    private static final int LIMIT = 5;
    private static final long WINDOW_SECONDS = 15 * 60;

    public synchronized boolean allow(String key) {
        long now = Instant.now().getEpochSecond();
        Bucket b = buckets.get(key);
        if (b == null || now > b.resetAt) {
            b = new Bucket();
            b.count = 0;
            b.resetAt = now + WINDOW_SECONDS;
            buckets.put(key, b);
        }
        if (b.count >= LIMIT) {
            return false;
        }
        b.count++;
        return true;
    }

    public long secondsUntilReset(String key) {
        Bucket b = buckets.get(key);
        if (b == null)
            return 0;
        long now = Instant.now().getEpochSecond();
        return Math.max(0, b.resetAt - now);
    }
}
