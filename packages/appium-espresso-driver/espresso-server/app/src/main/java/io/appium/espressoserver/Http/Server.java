package io.appium.espressoserver.Http;

import com.google.gson.Gson;

import java.io.IOException;

import fi.iki.elonen.NanoHTTPD;
import io.appium.espressoserver.Exceptions.DuplicateRouteException;
import io.appium.espressoserver.Exceptions.ServerErrorException;

public class Server extends NanoHTTPD {

    Router router;

    public Server() throws IOException, ServerErrorException {
        super(8080);
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning! Point your browsers to http://localhost:8080/ \n");
        try {
            router = new Router();
        } catch (DuplicateRouteException e) {
            throw new ServerErrorException();
        }
    }

    @Override
    public Response serve(IHTTPSession session) {
        AppiumResponse response = router.route(session);
        Gson gson = new Gson();
        return newFixedLengthResponse(response.getStatus(), "application/json", gson.toJson(response.getResponse()));
    }
}