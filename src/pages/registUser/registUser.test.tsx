import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/userInfoStore";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, afterEach, expect, beforeEach } from "vitest";
import { logout } from "../../slices/auth/authSlice";
import RegistUser from "./registUser.tsx";
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
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
  });

  // ここにテストケースを追加していく
  it("ユーザー登録API成功時、ホーム画面に遷移し、ユーザー情報がストアに保存されることを確認", async () => {
    const userRegist = userEvent.setup();

    const mockedPost = vi.mocked(apiClient.post);

    mockedPost.mockResolvedValue({
      data: {
        responseInfo: {
          code: "200",
          message: "success",
        },
        data: {
          userId: "registSuccessUser",
          userName: "registSuccessUserName",
          loginCheck: true,
          message: "ユーザー登録に成功しました。",
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
      expect(
        screen.getByText("パスワードは8文字以上で入力してください。")
      ).toBeInTheDocument();
    });
  });

  it("パスワードが8桁未満の場合、エラーメッセージが表示されることを確認", async () => {
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
      "lessThan8PassUser"
    );
    await userRegist.type(
      screen.getByPlaceholderText("ユーザー名を入力"),
      "lessThan8PassUserName"
    );
    await userRegist.type(
      screen.getByPlaceholderText("パスワードを入力"),
      "abcdefg"
    );
    await userRegist.type(
      screen.getByPlaceholderText("確認のため再入力"),
      "abcdefgh"
    );
    await userRegist.click(screen.getByRole("button", { name: "登録" }));

    // 各エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText("パスワードは8文字以上で入力してください。")
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
        screen.getByText("パスワードと確認用パスワードが一致しません。")
      ).toBeInTheDocument();
    });
  });

  it("ユーザー登録API失敗時（400エラー）、エラーメッセージが表示されることを確認", async () => {
    const userRegist = userEvent.setup();

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
            message: "ユーザーIDが重複しています。",
          },
        },
      } as any)
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
        screen.getByText("ユーザーIDが重複しています。")
      ).toBeInTheDocument();
    });
  });

  it("ユーザー登録API失敗時（500エラー）、エラーメッセージが表示されることを確認", async () => {
    const userRegist = userEvent.setup();

    const mockedPost = vi.mocked(apiClient.post);

    mockedPost.mockRejectedValue(
      new AxiosError(" Internal Server Error", "500", undefined, undefined, {
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
        screen.getByText("サーバー内部でエラーが発生しました。")
      ).toBeInTheDocument();
    });
  });
});
