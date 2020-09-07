package xxw.controller;

import net.sf.json.JSONObject;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by lp on 2020/9/1.
 */
@ServerEndpoint("/webSocket/{userId}")
public class WebSocket {
    private static int onlineCount = 0;
    private static Map<String,WebSocket> clients = new ConcurrentHashMap<>();
    private Session session;
    private String userId;

    @OnOpen
    public void onOpen(@PathParam("userId")String userId,Session session){
        this.userId=userId;
        this.session=session;
    }
    @OnClose
    public void onClose(){
        clients.remove(userId);
    }
    @OnMessage
    public void onMessage(String message)throws IOException{
        JSONObject jsonObject = JSONObject.fromObject(message);
        String mes = (String)jsonObject.get("message");
        if (!jsonObject.get("To").equals("All")){
            sendMessageTo(mes, jsonObject.get("To").toString());
        }else{
            sendMessageAll("给所有人");
        }
    }
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    public void sendMessageTo(String message, String To) throws IOException {
        for (WebSocket item : clients.values()) {
            if (item.userId.equals(To) )
                item.session.getAsyncRemote().sendText(message);
        }
    }

    public void sendMessageAll(String message) throws IOException {
        for (WebSocket item : clients.values()) {
            item.session.getAsyncRemote().sendText(message);
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocket.onlineCount--;
    }

    public static synchronized Map<String, WebSocket> getClients() {
        return clients;
    }
}
