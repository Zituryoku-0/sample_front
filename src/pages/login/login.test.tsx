import { render, screen } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../../store/userInfoStore'
import Login from "./login.tsx";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi} from "vitest";

describe("Login Component", () => {
    const userLogin = userEvent.setup();

    it('ログインAPI成功時、onSuccessが呼ばれる', async() => {

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

        const response = await fetch("http://localhost:8080/login",);
        const data = await response.json();

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

        expect(data.userId).toBe("loginSuccessUser");
        expect(data.userName).toBe("loginSuccessUserName");
        expect(data.loginCheck).toBe(true);
        expect(window.location.pathname).toBe("/home");  // ログイン成功後、ホーム画面に遷移することを確認

    });

    it('ログイン失敗時、エラーメッセージが表示される', async() => {

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

        const response = await fetch("http://localhost:8080/login",);
        const data = await response.json();

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

        expect(data.userId).toBe("");
        expect(data.userName).toBe("");
        expect(data.loginCheck).toBe(false);
        // ログイン失敗時、エラーメッセージが表示されることを確認
        expect(screen.getByText(/ユーザーIDまたはパスワードが正しくありません/)).toBeInTheDocument();
    })
});