import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import patientSlice from "./slices/patientSlice";
import testSlice from "./slices/testSlice";
import visitSlice from "./slices/visitSlice";
import testOrderSlice from "./slices/testOrderSlice";
import testResultSlice from "./slices/testResultSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientSlice,
    tests: testSlice,
    visits: visitSlice,
    testOrders: testOrderSlice,
    testResults: testResultSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
