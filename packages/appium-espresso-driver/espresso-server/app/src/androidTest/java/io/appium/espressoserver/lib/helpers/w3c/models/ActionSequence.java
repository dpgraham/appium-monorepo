package io.appium.espressoserver.lib.helpers.w3c.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import io.appium.espressoserver.lib.handlers.exceptions.AppiumException;
import io.appium.espressoserver.lib.handlers.exceptions.InvalidArgumentException;
import io.appium.espressoserver.lib.handlers.exceptions.NotYetImplementedException;
import io.appium.espressoserver.lib.helpers.w3c.adapter.W3CActionAdapter;
import io.appium.espressoserver.lib.helpers.w3c.state.InputStateTable;

import static io.appium.espressoserver.lib.helpers.w3c.processor.ActionsProcessor.processSourceActionSequence;

/**
 * The algorithm for extracting an action sequence from a request takes the JSON Object representing
 * an action sequence, validates the input, and returns a data structure that is the transpose of
 * the input JSON, such that the actions to be performed in a single tick are grouped together
 *
 * (Defined in 17.3 of spec 'extract an action sequence')
 */
public class ActionSequence implements Iterator<Tick> {

    private List<Tick> ticks = new ArrayList<>();
    private int tickCounter = 0;

    public ActionSequence(Actions actions, ActiveInputSources activeInputSources,
                          InputStateTable inputStateTable)
            throws InvalidArgumentException, NotYetImplementedException {
        // Check if null to keep Codacy happy. It will never make it this far if it's null though.
        if (actions.getActions() != null) {
            for (InputSource inputSource : actions.getActions()) {
                int tickIndex = 0;
                List<ActionObject> actionObjects = processSourceActionSequence(inputSource, activeInputSources, inputStateTable);
                for (ActionObject action : actionObjects) {
                    if (ticks.size() == tickIndex) {
                        ticks.add(new Tick());
                    }
                    Tick tick = ticks.get(tickIndex);
                    tick.addAction(action);
                    tickIndex++;
                }
            }
        }
    }

    @Override
    public boolean hasNext() {
        return tickCounter < ticks.size();
    }

    @Override
    public Tick next() {
        return ticks.get(tickCounter++);
    }

    /**
     * Call the dispatch algorithm defined in 17.4
     * @param adapter Touch action adapter
     * @param inputStateTable Input states for a session
     * @throws AppiumException
     * @throws InterruptedException
     * @throws ExecutionException
     */
    public void dispatch(W3CActionAdapter adapter, InputStateTable inputStateTable)
            throws AppiumException, InterruptedException, ExecutionException {
        for(Tick tick: ticks) {
            long timeAtBeginningOfTick = System.currentTimeMillis();
            long tickDuration = tick.calculateTickDuration();
            List<Callable<Void>> callables = tick.dispatch(adapter, inputStateTable, tickDuration);

            // 2. Wait until the following conditions are all met:

            //  2.1 Wait for any pending async operations
            if (!callables.isEmpty()) {
                Executor executor = Executors.newFixedThreadPool(callables.size());
                CompletionService<Void> completionService = new ExecutorCompletionService<>(executor);
                for (Callable<Void> callable : callables) {
                    completionService.submit(callable);
                }

                int received = 0;
                while (received < callables.size()) {
                    Future<Void> resultFuture = completionService.take(); //blocks if none available
                    resultFuture.get();
                    received++;
                }
            }

            //  2.2 At least tick duration milliseconds have passed
            long timeSinceBeginningOfTick = System.currentTimeMillis() - timeAtBeginningOfTick;
            if (timeSinceBeginningOfTick < tickDuration) {
                adapter.sleep(tickDuration - timeSinceBeginningOfTick);
            }

            // 2.3 The UI thread is complete
            adapter.waitForUiThread();
        }
    }
}
