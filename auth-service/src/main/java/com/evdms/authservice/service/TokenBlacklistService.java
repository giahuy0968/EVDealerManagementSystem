package com.evdms.authservice.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {
    private static class Entry {
        long expiresAt;
    }

    private final Map<String, Entry> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, long ttlSeconds) {
        Entry e = new Entry();
        e.expiresAt = Instant.now().getEpochSecond() + ttlSeconds;
        blacklist.put(token, e);
    }

    public boolean isBlacklisted(String token) {
        Entry e = blacklist.get(token);
        if (e == null)
            return false;
        if (Instant.now().getEpochSecond() > e.expiresAt) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }
}
