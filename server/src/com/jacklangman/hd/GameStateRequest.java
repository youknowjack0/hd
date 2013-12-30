package com.jacklangman.hd;

/**
 * Created by jack on 29/12/13.
 */
public class GameStateRequest {
    int gameId;
    PlayerState myPosition;



    public int getGameId() {
        return gameId;
    }

    public PlayerState getMyPosition() {
        return myPosition;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public void setMyPosition(PlayerState myPosition) {
        this.myPosition = myPosition;
    }
}