package com.jacklangman.hd;

import java.util.ArrayList;

/**
 * server side gamestate object
 */
public class GameState {

    int index;
    ArrayList<TimedPlayerState> positions = new ArrayList<TimedPlayerState>();

    static final int cleanTime = 30000;

    long nextCleanup;

    int nextPlayerId = 0;

    public GameState(int index) {
        this.index = index;
        this.nextCleanup = System.currentTimeMillis() + cleanTime;
    }

    public int addPlayer() {
        synchronized (this) {
            int pid = nextPlayerId++;
            return pid;
        }

    }

    private void cleanup() {
        long now = System.currentTimeMillis();
        this.nextCleanup = now + cleanTime;

        int j=0;
        int len = positions.size();
        for(int i=0;i<positions.size();i++) {
            TimedPlayerState pi = positions.get(i);
            if(pi.getExpiresAt() > now)
            {
                if(i != j)
                    positions.set(j, pi);
                j++;
            }
            else {
                len--;
            }
        }
        for(int i=positions.size()-1;i >= len;i--)
            positions.remove(i);
    }

    public GameStateResponse Update(GameStateRequest req) {
        GameStateResponse pr = new GameStateResponse();
        synchronized (this) {
            if(System.currentTimeMillis() > nextCleanup)
                cleanup();

            int myId = req.getMyPosition().getPlayerId();

            pr.setGameId(index);
            ArrayList<PlayerState> pus = new ArrayList<PlayerState>();
            boolean hasMyState = false;

            for (int i = 0; i < positions.size(); i++) {
                TimedPlayerState pos = positions.get(i);
                if (pos.getPlayerId() != myId)
                    pus.add(pos);
                else {
                    positions.set(i, createPlayerState(req));
                    hasMyState = true;
                }
            }

            if(!hasMyState)
                positions.add(createPlayerState(req));


            pr.setPlayers(pus);
        }
        return pr;
    }

    private TimedPlayerState createPlayerState(GameStateRequest req) {
        return new TimedPlayerState(req.getMyPosition(), System.currentTimeMillis() + cleanTime);
    }


}
