import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

// Define the initial state type
interface AuthState {
  userInfo: User | null;
}

// Initial state with localStorage handling
const initialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: state => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
