import { useState } from 'react';
import "./login.css";
import type { UserInfo } from '../../interface/userInfo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserInfoSchema } from './login';
import type { userFormSchema, userInfoSchema } from './login';
import { useNavigate } from 'react-router-dom';



function Login() {

    // TODOログイン処理を追加する
    // 将来的に使う予定のため、これらの変数は残しておく
    // @param userId, userPassword
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const navigate = useNavigate();

    // React-hook-form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<userFormSchema>({
        resolver: zodResolver(userSchema),
        mode: "onBlur", // blur時にバリデーション
        reValidateMode: "onChange", // 入力が変わる度に再チェック
        defaultValues: {
            userId: "",
            password: "",
        }
    });

    const handleClick = async (data: userFormSchema) => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: data.userId, password: data.password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();
            const responseData = UserInfoSchema.safeParse(rawData);
            if (!responseData.success) {
                console.error("JSON の形式が不正です:", rawData.error);
                setError("サーバーからの応答形式が不正です。再度お試しください。");
                return;
            }
            if (rawData.loginCheck) {
                setUserInfo(rawData);
                navigate('/home');
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            reset();
            setLoading(false);
            setIsLogging(false);
        }
    };
    return (
        <div className="login-container">
            <div className="login-box" aria-labelledby="login-title">
                <h1 id="login-title" className="login-title">ログイン</h1>

                <form
                    className="login-form"
                    onSubmit={handleSubmit(handleClick)}
                    noValidate
                >
                    <div className="form-group">
                        <label htmlFor="userId">ユーザーID</label>
                        <input
                            type="text"
                            id="userId"
                            placeholder="ユーザーIDを入力"
                            inputMode="text"
                            autoComplete="username"
                            aria-invalid={!!errors.userId}
                            aria-describedby={errors.userId ? 'userId-error' : undefined}
                            {...register('userId')}
                        />
                        {errors.userId && (
                            <p id="userId-error" className="mt-1 text-sm text-red-600">
                                {errors.userId.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">パスワード</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="パスワードを入力"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="login-button" aria-label="ログイン">
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;