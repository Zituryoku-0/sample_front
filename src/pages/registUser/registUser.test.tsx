import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/userInfoStore";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, afterEach, expect } from "vitest";
import { logout } from "../../slices/auth/authSlice";
import RegistUser from "./registUser.tsx";

// 確定テスト後にモックやストアをリセット
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  try {
    store.dispatch(logout());
  } catch {
    // ベストエフォートでのリセット
  }
  window.history.pushState({}, "", "/registUser");
});

describe("RegistUser Component", () => {
  // ここにテストケースを追加していく
  it("ユーザー登録API成功時、ホーム画面に遷移し、ユーザー情報がストアに保存されることを確認", async () => {
    const userRegist = userEvent.setup();

    // fetchをモック
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            userId: "registSuccessUser",
            userName: "registSuccessUserName",
            loginCheck: true,
          }),
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegistUser />
        </BrowserRouter>
      </Provider>
    );

    await userRegist.type(
      screen.getByPlaceholderText("ユーザーIDを入力"),
      "registSuccessUser"
    );
    await userRegist.type(
      screen.getByPlaceholderText("ユーザー名を入力"),
      "registSuccessUserName"
    );
    await userRegist.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "registSuccessPassword"
    );
    await userRegist.type(
      screen.getByPlaceholderText("確認のため再入力"),
      "registSuccessPassword"
    );
    await userRegist.click(screen.getByRole("button", { name: "登録" }));

    // ホーム画面に遷移することを確認
    await waitFor(() => {
      expect(window.location.pathname).toBe("/home");
      expect(store.getState().auth.user?.userId).toBe("registSuccessUser");
      expect(store.getState().auth.user?.userName).toBe(
        "registSuccessUserName"
      );
      expect(store.getState().auth.user?.loginCheck).toBe(true);
    });
  });

  it("各入力項目が未入力の場合、エラーメッセージが表示されることを確認", async () => {
    const userRegist = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegistUser />
        </BrowserRouter>
      </Provider>
    );

    await userRegist.click(screen.getByRole("button", { name: "登録" }));

    // 各エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("ユーザーIDは必須です。")).toBeInTheDocument();
      expect(screen.getByText("ユーザー名は必須です。")).toBeInTheDocument();
      expect(screen.getByText("パスワードは必須です。")).toBeInTheDocument();
      expect(
        screen.getByText("確認用パスワードは必須です。")
      ).toBeInTheDocument();
    });
  });

  it("パスワードとパスワード（確認）が一致しない場合、エラーメッセージが表示されることを確認", async () => {
    const userRegist = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegistUser />
        </BrowserRouter>
      </Provider>
    );

    await userRegist.type(
      screen.getByPlaceholderText("ユーザーIDを入力"),
      "registMismatchUser"
    );
    await userRegist.type(
      screen.getByPlaceholderText("ユーザー名を入力"),
      "registMismatchUserName"
    );
    await userRegist.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "registMismatchPassword"
    );
    await userRegist.type(
      screen.getByPlaceholderText("確認のため再入力"),
      "differentPassword"
    );
    await userRegist.click(screen.getByRole("button", { name: "登録" }));

    // パスワード不一致のエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText("パスワードが一致しません。")
      ).toBeInTheDocument();
    });
  });

  it("ユーザー登録API失敗時、エラーメッセージが表示されることを確認", async () => {
    const userRegist = userEvent.setup();

    // fetchをモック
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 400,
        json: () =>
          Promise.resolve({
            responseInfo: {
              code: "400",
              message: "error",
            },
            data: {
              userId: "",
              userName: "",
              loginCheck: false,
              message: "サンプルエラー。",
            },
          }),
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegistUser />
        </BrowserRouter>
      </Provider>
    );

    await userRegist.type(
      screen.getByPlaceholderText("ユーザーIDを入力"),
      "registErrorUser"
    );
    await userRegist.type(
      screen.getByPlaceholderText("ユーザー名を入力"),
      "registErrorUserName"
    );
    await userRegist.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "registErrorPassword"
    );
    await userRegist.type(
      screen.getByPlaceholderText("確認のため再入力"),
      "registErrorPassword"
    );
    await userRegist.click(screen.getByRole("button", { name: "登録" }));

    // APIエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText(
          "サーバーからの応答形式が不正です。再度お試しください。"
        )
      ).toBeInTheDocument();
    });
  });
});
