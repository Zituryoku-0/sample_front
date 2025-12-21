import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/userInfoStore";
import Login from "./login.tsx";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { logout } from "../../slices/auth/authSlice";
import { apiClient } from "../../lib/apiClient.ts";
import { AxiosError } from "axios";

// apiClientのモック化
vi.mock("../../lib/apiClient", () => {
  return {
    apiClient: {
      post: vi.fn(),
    },
  };
});

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
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
  });

  it("ログインAPI成功時、ホーム画面に遷移し、ユーザー情報がストアに保存されることを確認", async () => {
    const userLogin = userEvent.setup();

    const mockedPost = vi.mocked(apiClient.post);

    mockedPost.mockResolvedValue({
      data: {
        responseInfo: {
          code: "200",
          message: "success",
        },
        data: {
          userId: "loginSuccessUser",
          userName: "loginSuccessUserName",
          loginCheck: true,
          message: "ログインに成功しました。",
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

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

  it("ログイン失敗時、ホーム画面に遷移せず、ストアにユーザー情報が保存されないことを確認（400エラー）", async () => {
    const userLogin = userEvent.setup();

    const mockedPost = vi.mocked(apiClient.post);

    mockedPost.mockRejectedValue(
      new AxiosError("Bad Request", "400", undefined, undefined, {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
        data: {
          responseInfo: {
            code: "400",
            message: "Bad Request",
          },
          data: {
            userId: "",
            userName: "",
            loginCheck: false,
            message: "ユーザーIDまたはパスワードが違います。",
          },
        },
      } as any)
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

  it("ログイン失敗時、ホーム画面に遷移せず、ストアにユーザー情報が保存されないことを確認（500エラー）", async () => {
    const userLogin = userEvent.setup();

    const mockedPost = vi.mocked(apiClient.post);

    mockedPost.mockRejectedValue(
      new AxiosError("Internal Server Error", "500", undefined, undefined, {
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
        data: {
          responseInfo: {
            code: "500",
            message: "Internal Server Error",
          },
          data: {
            userId: "",
            userName: "",
            loginCheck: false,
            message: "サーバー内部でエラーが発生しました。",
          },
        },
      } as any)
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
