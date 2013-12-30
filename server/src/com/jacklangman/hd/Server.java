package com.jacklangman.hd;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;


public class Server extends HttpServlet {

    GameManager manager;
    ObjectMapper json;

    public void init() throws ServletException {

        manager = new GameManager();
        manager.CreateGame();//0 id game
        json = new ObjectMapper();
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin" ,"*");
        route(request, response);
    }

    private void route(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");

        String q = request.getParameter("q");

        if(q == null)
            return;

        if(q.equals("pu")) {
            positionUpdate(request,response);
        }
        else if(q.equals("join")) {
            join(request, response);
        }
    }

    private void join(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int playerId = manager.GetGame(0).addPlayer();
        json.writeValue(response.getWriter(), new JoinResponse(playerId));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        route(request, response);
    }

    private void positionUpdate(HttpServletRequest request, HttpServletResponse response) throws IOException {

        GameStateRequest req = json.readValue(request.getReader(), GameStateRequest.class);

        GameState game = manager.GetGame(0); //only one game for everyone for now

        GameStateResponse pr = game.Update(req);
        json.writeValue(response.getWriter(), pr);
    }
}
