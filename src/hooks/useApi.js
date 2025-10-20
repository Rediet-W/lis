import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/uiSlice";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const callApi = useCallback(
    async (apiCall, successMessage = null, errorMessage = null) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (successMessage) {
          dispatch(
            addNotification({
              type: "success",
              message: successMessage,
            })
          );
        }

        return response;
      } catch (err) {
        const message = errorMessage || err.message || "Something went wrong";
        setError(message);

        dispatch(
          addNotification({
            type: "error",
            message,
          })
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};
