package io.appium.espressoserver.lib.Model;

import java.util.UUID;


public class Session {
    private final String id;

    // Only one session can run at a time so globally cache the current Session ID
    private static String ID;

    public Session() {
        if (Session.ID != null) {
            this.id = Session.ID;
        } else {
            this.id = UUID.randomUUID().toString();
            Session.ID = this.id;
        }
    }

    public String getId () {
        return id;
    }

    public static String getGlobalSessionId() {
        return Session.ID;
    }
}
