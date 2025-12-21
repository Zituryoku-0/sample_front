import { useState } from "react";
import "./login.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./login";
import { fetchLoginUser, UserInfoSchema } from "../../lib/userApi";
import type { UserFormSchema } from "./login";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/userInfoStore";
import { login } from "../../slices/auth/authSlice";
import Loading from "../loading/loading";
import type { AxiosError } from "axios";

function Login() {
  // TODOログイン処理を追加する
  // 将来的に使う予定のため、これらの変数は残しておく
  // @param userId, userPassword
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // React-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    mode: "onBlur", // blur時にバリデーション
    reValidateMode: "onChange", // 入力が変わる度に再チェック
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const handleClick = async (data: UserFormSchema) => {
    let responseData;
    try {
      setLoading(true);
      const response = await fetchLoginUser(data);
      // OKでもNGでもJSONを取得してパースする
      responseData = UserInfoSchema.safeParse(response);
      // フォームのリセット
      reset();
      console.log(responseData);
      // HTTPステータスコードが2xxでない場合はエラーとする
      if (!responseData.data?.responseInfo.code.startsWith("2")) {
        throw new Error(
          `HTTP error! status: ${responseData.data?.responseInfo.code}`
        );
      }
      if (!responseData.success) {
        console.error("JSON の形式が不正です:", responseData.error);
        setError("サーバーからの応答形式が不正です。再度お試しください。");
        return;
      }
      if (responseData.data.data.loginCheck) {
        dispatch(
          login({
            userId: responseData.data.data.userId,
            userName: responseData.data.data.userName,
            loginCheck: responseData.data.data.loginCheck,
          })
        );
        navigate("/home");
      } else {
        setError(
          "ログインに失敗しました。ユーザーIDまたはパスワードが正しくありません。"
        );
      }
    } catch (err: AxiosError | unknown) {
      if (err instanceof Error) {
        setError("サーバー内部でエラーが発生しました。");
      } else {
        setError("サーバー内部でエラーが発生しました。");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">
          ログイン
        </h1>

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
              aria-describedby={errors.userId ? "userId-error" : undefined}
              {...register("userId")}
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
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" aria-label="ログイン">
            ログイン
          </button>
        </form>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default Login;
