package com.jacklangman.hd;

/**
 * Created by jack on 30/12/13.
 */
public class GameStateResponse {
    private Iterable<PlayerState> players;
    private int gameId;

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public Iterable<PlayerState> getPlayers() {
        return players;
    }

    public void setPlayers(Iterable<PlayerState> players) {
        this.players = players;
    }
}
