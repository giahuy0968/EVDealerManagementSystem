package com.evdms.customerservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RoundRobinService {
    // Map: dealerId -> list of staff IDs
    private final Map<UUID, List<UUID>> dealerStaffMap = new ConcurrentHashMap<>();
    // Map: dealerId -> current index
    private final Map<UUID, AtomicInteger> dealerIndexMap = new ConcurrentHashMap<>();
    
    public void registerStaff(UUID dealerId, List<UUID> staffIds) {
        dealerStaffMap.put(dealerId, new ArrayList<>(staffIds));
        dealerIndexMap.putIfAbsent(dealerId, new AtomicInteger(0));
    }
    
    public UUID getNextStaff(UUID dealerId) {
        List<UUID> staffList = dealerStaffMap.get(dealerId);
        if (staffList == null || staffList.isEmpty()) {
            return null;
        }
        
        AtomicInteger index = dealerIndexMap.get(dealerId);
        int currentIndex = index.getAndUpdate(i -> (i + 1) % staffList.size());
        return staffList.get(currentIndex);
    }
}
