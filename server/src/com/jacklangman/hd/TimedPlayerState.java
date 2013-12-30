package com.jacklangman.hd;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Created by jack on 30/12/13.
 */
public class TimedPlayerState extends PlayerState implements Comparable<TimedPlayerState> {

    @JsonIgnore
    private long expiresAt;

    public TimedPlayerState(PlayerState myPosition, long expiresAt) {
        super(myPosition.getPx(), myPosition.getPy(), myPosition.getPz(), myPosition.getRx(), myPosition.getRy(), myPosition.getRz(), myPosition.getRw(), myPosition.getPlayerId());
        this.expiresAt = expiresAt;
    }

    @JsonIgnore
    public long getExpiresAt() {
        return expiresAt;
    }

    @Override
    public int compareTo(TimedPlayerState o) {
        return Long.compare(this.getExpiresAt(),o.getExpiresAt());
    }
}
