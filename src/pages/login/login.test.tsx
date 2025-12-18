import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/userInfoStore";
import Login from "./login.tsx";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { logout } from "../../slices/auth/authSlice";

// 各テスト後にモックやストアをリセット
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  try {
    store.dispatch(logout());
  } catch {
    // ベストエフォートでのリセット
  }
  window.history.pushState({}, "", "/login");
});

describe("Login Component", () => {
  it("ログインAPI成功時、ホーム画面に遷移し、ユーザー情報がストアに保存されることを確認", async () => {
    const userLogin = userEvent.setup();

    // fetchをモック
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            userId: "loginSuccessUser",
            userName: "loginSuccessUserName",
            loginCheck: true,
          }),
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    await userLogin.type(
      screen.getByPlaceholderText("ユーザーIDを入力"),
      "loginSuccessUser"
    );
    await userLogin.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "loginSuccessPassword"
    );
    await userLogin.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/home"); // ログイン成功後、ホーム画面に遷移することを確認
      expect(store.getState().auth.user?.userId).toBe("loginSuccessUser");
      expect(store.getState().auth.user?.userName).toBe("loginSuccessUserName");
      expect(store.getState().auth.user?.loginCheck).toBe(true);
    });
  });

  it("ログイン失敗時、ホーム画面に遷移せず、ストアにユーザー情報が保存されないことを確認", async () => {
    const userLogin = userEvent.setup();

    // fetchをモック
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            userId: "",
            userName: "",
            loginCheck: false,
            message: "ユーザーIDまたはパスワードが違います。",
          }),
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    await userLogin.type(
      screen.getByPlaceholderText("ユーザーIDを入力"),
      "loginFailureUser"
    );
    await userLogin.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "loginFailurePassword"
    );
    await userLogin.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login"); // ログインに失敗後、ホーム画面に遷移しないことを確認
      expect(store.getState().auth.user).toBe(null); // ストアにユーザー情報が保存されていないことを確認
    });
  });
});
