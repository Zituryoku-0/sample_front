import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/userInfoStore";
import Login from "./login.tsx";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, afterEach} from "vitest";
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
    window.history.pushState({}, '', '/login');
});

describe("Login Component", () => {

    it('ログインAPI成功時、ホーム画面に遷移し、ユーザー情報がストアに保存されることを確認', async() => {

        const userLogin = userEvent.setup();

        // fetchをモック
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                "userId": "loginSuccessUser",
                "userName": "loginSuccessUserName",
                "loginCheck": true
            }),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "loginSuccessUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "loginSuccessPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(window.location.pathname).toBe("/home"); // ログイン成功後、ホーム画面に遷移することを確認
            expect(store.getState().auth.user?.userId).toBe("loginSuccessUser");
            expect(store.getState().auth.user?.userName).toBe("loginSuccessUserName");
            expect(store.getState().auth.user?.loginCheck).toBe(true);
        });
    });

    it('ログイン失敗時、ホーム画面に遷移せず、ストアにユーザー情報が保存されないことを確認', async() => {

        const userLogin = userEvent.setup();

        // fetchをモック
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            status: 400,
            json: () => Promise.resolve({
                "userId": "",
                "userName": "",
                "loginCheck": false,
                "message": "ユーザーIDまたはパスワードが違います。"
            }),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "loginFailureUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "loginFailurePassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(window.location.pathname).toBe("/login"); // ログインに失敗後、ホーム画面に遷移しないことを確認
            expect(store.getState().auth.user).toBe(null); // ストアにユーザー情報が保存されていないことを確認
        });
    });

    it('ネットワークエラー時、エラーメッセージが表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック（ネットワークエラー）
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network request failed")));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(screen.getByText("Network request failed")).toBeInTheDocument();
            expect(window.location.pathname).toBe("/login");
            expect(store.getState().auth.user).toBe(null);
        });
    });

    it('500エラー時、エラーメッセージが表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック（500エラー）
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(screen.getByText("HTTP error! status: 500")).toBeInTheDocument();
            expect(window.location.pathname).toBe("/login");
            expect(store.getState().auth.user).toBe(null);
        });
    });

    it('JSONスキーマ検証失敗時、エラーメッセージが表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック（不正なJSONスキーマ）
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                "invalidField": "invalid",
                // userId, userName, loginCheck が欠落
            }),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(screen.getByText("サーバーからの応答形式が不正です。再度お試しください。")).toBeInTheDocument();
            expect(window.location.pathname).toBe("/login");
            expect(store.getState().auth.user).toBe(null);
        });
    });

    it('空のユーザーIDでバリデーションエラーが表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const userIdInput = screen.getByPlaceholderText("ユーザーIDを入力");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        
        // ユーザーIDフィールドをフォーカスしてからブラー
        await userLogin.click(userIdInput);
        await userLogin.tab(); // フォーカスを外す

        await waitFor(() => {
            expect(screen.getByText("ユーザーIDを入力してください")).toBeInTheDocument();
        });
    });

    it('空のパスワードでバリデーションエラーが表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const passwordInput = screen.getByPlaceholderText("パスワードを入力");
        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        
        // パスワードフィールドをフォーカスしてからブラー
        await userLogin.click(passwordInput);
        await userLogin.tab(); // フォーカスを外す

        await waitFor(() => {
            expect(screen.getByText("パスワードを入力してください")).toBeInTheDocument();
        });
    });

    it('ローディング状態が正しく表示されることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック（遅延をシミュレート）
        vi.stubGlobal("fetch", vi.fn().mockImplementation(() => 
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({
                            "userId": "testUser",
                            "userName": "testUserName",
                            "loginCheck": true
                        }),
                    });
                }, 100);
            })
        ));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        // ローディング状態を確認
        expect(screen.getByText("読み込み中...")).toBeInTheDocument();

        // ローディング完了を待つ
        await waitFor(() => {
            expect(screen.queryByText("読み込み中...")).not.toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('Redux storeへのディスパッチが正しく行われることを確認', async() => {
        const userLogin = userEvent.setup();
        const dispatchSpy = vi.spyOn(store, 'dispatch');

        // fetchをモック
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                "userId": "testUser",
                "userName": "testUserName",
                "loginCheck": true
            }),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: expect.stringContaining('login'),
                    payload: expect.objectContaining({
                        userId: "testUser",
                        userName: "testUserName",
                        loginCheck: true
                    })
                })
            );
        });
    });

    it('Enterキーでフォームが送信されることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                "userId": "testUser",
                "userName": "testUserName",
                "loginCheck": true
            }),
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        await userLogin.type(screen.getByPlaceholderText("ユーザーIDを入力"), "testUser");
        await userLogin.type(screen.getByPlaceholderText("パスワードを入力"), "testPassword");
        
        // Enterキーでフォーム送信
        await userLogin.keyboard('{Enter}');

        await waitFor(() => {
            expect(window.location.pathname).toBe("/home");
            expect(store.getState().auth.user?.userId).toBe("testUser");
        });
    });

    it('エラー後にフォームがリセットされることを確認', async() => {
        const userLogin = userEvent.setup();

        // fetchをモック（エラー）
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const userIdInput = screen.getByPlaceholderText("ユーザーIDを入力") as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText("パスワードを入力") as HTMLInputElement;

        await userLogin.type(userIdInput, "testUser");
        await userLogin.type(passwordInput, "testPassword");

        // 入力値を確認
        expect(userIdInput.value).toBe("testUser");
        expect(passwordInput.value).toBe("testPassword");

        await userLogin.click(screen.getByRole("button", {name: "ログイン"}));

        // エラー表示を待つ
        await waitFor(() => {
            expect(screen.getByText("Network error")).toBeInTheDocument();
        });

        // フォームがリセットされたことを確認
        await waitFor(() => {
            expect(userIdInput.value).toBe("");
            expect(passwordInput.value).toBe("");
        });
    });
});