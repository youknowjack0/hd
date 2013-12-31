package com.jacklangman.hd;

import com.google.apphosting.api.ApiProxy;
import com.sun.javaws.exceptions.InvalidArgumentException;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by jack on 29/12/13.
 */
public class GameManager {

    private Object syncLock = new Object();

    private ArrayList<GameState> games = new ArrayList<GameState>();

    private int index = 0;

    public GameState CreateGame() {
        GameState gs;

        synchronized (syncLock) {
            gs = new GameState(index);
            games.add(gs);
            index ++ ;
        }
        return gs;
    }

    public GameState GetGame(int index) {
        GameState gs;
        synchronized (syncLock) {
            if(index >= games.size())
                throw new IllegalArgumentException("index");

            gs = games.get(index);
        }
        return gs;
    }


}
