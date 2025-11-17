import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import patientSlice from "./slices/patientSlice";
import testSlice from "./slices/testSlice";
import visitSlice from "./slices/visitSlice";
import testOrderSlice from "./slices/testOrderSlice";
import testResultSlice from "./slices/testResultSlice";
import uiSlice from "./slices/uiSlice";
import clinicSlice from "./slices/clinicSlice";
import activityLogSlice from "./slices/activityLogSlice";
import userSlice from "./slices/userSlice";
import testParameterSlice from "./slices/testParameterSlice";
import dynamicQuestionSlice from "./slices/dynamicQuestionSlice";
import referenceRangeSlice from "./slices/referenceRangeSlice";
import pathologistReportSlice from "./slices/pathologistResultSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientSlice,
    tests: testSlice,
    visits: visitSlice,
    testOrders: testOrderSlice,
    testResults: testResultSlice,
    ui: uiSlice,
    clinic: clinicSlice,
    activityLogs: activityLogSlice,
    users: userSlice,
    testParameters: testParameterSlice,
    dynamicQuestions: dynamicQuestionSlice,
    referenceRanges: referenceRangeSlice,
    pathologistReports: pathologistReportSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
