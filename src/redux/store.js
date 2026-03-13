import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import rootSaga from "./saga"; // it container all watcher saga

const sagaMiddleware = createSagaMiddleware(); // listen actions and workers and handle async

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});
// redux store -> default middleware -> saga middleware

sagaMiddleware.run(rootSaga); // starts listening for actions

export default store;
