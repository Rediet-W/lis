import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dynamicQuestionService from "../../services/dynamicQuestionService";
import { toast } from "react-toastify";

// Thunks for Dynamic Questions
export const fetchDynamicQuestions = createAsyncThunk(
  "dynamicQuestions/fetchDynamicQuestions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dynamicQuestionService.getAllDynamicQuestions(
        filters
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch questions";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchQuestionsByTest = createAsyncThunk(
  "dynamicQuestions/fetchQuestionsByTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await dynamicQuestionService.getByTest(testId);
      return { testId, questions: response.data.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch questions";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createDynamicQuestion = createAsyncThunk(
  "dynamicQuestions/createDynamicQuestion",
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await dynamicQuestionService.createDynamicQuestion(
        questionData
      );
      toast.success(response.data.message || "Question created successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create question";
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach((err) => {
          toast.error(Array.isArray(err) ? err[0] : err);
        });
      } else {
        toast.error(errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateDynamicQuestion = createAsyncThunk(
  "dynamicQuestions/updateDynamicQuestion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await dynamicQuestionService.updateDynamicQuestion(
        id,
        data
      );
      toast.success(response.data.message || "Question updated successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update question";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteDynamicQuestion = createAsyncThunk(
  "dynamicQuestions/deleteDynamicQuestion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await dynamicQuestionService.deleteDynamicQuestion(id);
      toast.success(response.data.message || "Question deleted successfully");
      return id;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete question";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const dynamicQuestionSlice = createSlice({
  name: "dynamicQuestions",
  initialState: {
    questions: [],
    questionsByTest: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearQuestionsByTest: (state, action) => {
      const testId = action.payload;
      delete state.questionsByTest[testId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Questions
      .addCase(fetchDynamicQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDynamicQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchDynamicQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Questions by Test
      .addCase(fetchQuestionsByTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionsByTest.fulfilled, (state, action) => {
        state.loading = false;
        const { testId, questions } = action.payload;
        state.questionsByTest[testId] = questions;
      })
      .addCase(fetchQuestionsByTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Question
      .addCase(createDynamicQuestion.fulfilled, (state, action) => {
        const newQuestion = action.payload;
        state.questions.push(newQuestion);
        if (state.questionsByTest[newQuestion.test_id]) {
          state.questionsByTest[newQuestion.test_id].push(newQuestion);
        }
      })
      // Update Question
      .addCase(updateDynamicQuestion.fulfilled, (state, action) => {
        const updatedQuestion = action.payload;
        const index = state.questions.findIndex(
          (q) => q.id === updatedQuestion.id
        );
        if (index !== -1) {
          state.questions[index] = updatedQuestion;
        }
        if (state.questionsByTest[updatedQuestion.test_id]) {
          const testIndex = state.questionsByTest[
            updatedQuestion.test_id
          ].findIndex((q) => q.id === updatedQuestion.id);
          if (testIndex !== -1) {
            state.questionsByTest[updatedQuestion.test_id][testIndex] =
              updatedQuestion;
          }
        }
      })
      // Delete Question
      .addCase(deleteDynamicQuestion.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.questions = state.questions.filter((q) => q.id !== deletedId);
        Object.keys(state.questionsByTest).forEach((testId) => {
          state.questionsByTest[testId] = state.questionsByTest[testId].filter(
            (q) => q.id !== deletedId
          );
        });
      });
  },
});

export const { clearError, clearQuestionsByTest } =
  dynamicQuestionSlice.actions;
export default dynamicQuestionSlice.reducer;
