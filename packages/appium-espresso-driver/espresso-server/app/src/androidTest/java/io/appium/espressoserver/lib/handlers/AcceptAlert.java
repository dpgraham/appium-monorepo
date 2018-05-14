/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.appium.espressoserver.lib.handlers;

import io.appium.espressoserver.lib.handlers.exceptions.AppiumException;
import io.appium.espressoserver.lib.helpers.AlertHelpers;
import io.appium.espressoserver.lib.model.AlertParams;

public class AcceptAlert implements RequestHandler<AlertParams, Void> {

    @Override
    public Void handle(AlertParams params) throws AppiumException {
        // We use UIA2 here, since Espresso is limited to application sandbox
        // and cannot handle security alerts
        AlertHelpers.handle(AlertHelpers.AlertAction.ACCEPT, params.getButtonLabel());
        return null;
    }
}
