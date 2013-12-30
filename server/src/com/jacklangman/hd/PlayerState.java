package com.jacklangman.hd;

/**
 * Created by jack on 30/12/13.
 */
public class PlayerState {

    float px;
    float py;
    float pz;
    float rx;
    float ry;
    float rz;
    float rw;
    int playerId;

    public PlayerState() {
    }

    public PlayerState(float px, float py, float pz, float rx, float ry, float rz, float rw, int id) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.rw = rw;
        this.playerId = id;
    }

    public int getPlayerId() {
        return playerId;
    }

    public float getPx() {
        return px;
    }

    public float getPy() {
        return py;
    }

    public float getPz() {
        return pz;
    }

    public float getRx() {
        return rx;
    }

    public float getRy() {
        return ry;
    }

    public float getRz() {
        return rz;
    }

    public float getRw() {
        return rw;
    }
}
