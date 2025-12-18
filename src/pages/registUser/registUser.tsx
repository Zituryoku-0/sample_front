import { useState } from "react";
import "./registUser.css";
import { useForm } from "react-hook-form";
import type { registUserFormSchema } from "./registUser";
import Loading from "../loading/loading";
import { UserInfoSchema } from "../login/login";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/userInfoStore";
import { login } from "../../slices/auth/authSlice";
import { useNavigate } from "react-router-dom";

function RegistUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<registUserFormSchema>({
    mode: "onBlur",
    defaultValues: {
      userId: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: registUserFormSchema) => {
    setError(null);
    if (data.password !== data.confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/registUser", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.userId,
          userName: data.userName,
          password: data.password,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      const responseData = UserInfoSchema.safeParse(rawData);
      if (!responseData.success) {
        console.error("JSON の形式が不正です:", responseData.error);
        setError("サーバーからの応答形式が不正です。再度お試しください。");
        return;
      }
      if (responseData.data.loginCheck) {
        dispatch(
          login({
            userId: responseData.data.userId,
            userName: responseData.data.userName,
            loginCheck: responseData.data.loginCheck,
          })
        );
        navigate("/home");
      } else {
        setError("ユーザー登録に失敗しました。");
      }
    } catch (err: unknown) {
      setError("ユーザー登録中にエラーが発生しました。");
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      reset();
      setLoading(false);
    }
  };

  const pwd = watch("password");

  return (
    <div className="regist-container">
      <div className="regist-box" aria-labelledby="regist-title">
        <h1 id="regist-title" className="regist-title">
          ユーザー登録
        </h1>

        <form
          className="regist-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="userId">ユーザーID</label>
            <input
              id="userId"
              type="text"
              placeholder="ユーザーIDを入力"
              autoComplete="username"
              aria-invalid={!!errors.userId}
              aria-describedby={errors.userId ? "userId-error" : undefined}
              {...register("userId", { required: "ユーザーIDは必須です。" })}
            />
            {errors.userId && (
              <p id="userId-error" className="error-message">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userName">ユーザー名</label>
            <input
              id="userName"
              type="text"
              placeholder="ユーザー名を入力"
              autoComplete="name"
              aria-invalid={!!errors.userName}
              aria-describedby={errors.userName ? "userName-error" : undefined}
              {...register("userName", { required: "ユーザー名は必須です。" })}
            />
            {errors.userName && (
              <p id="userName-error" className="error-message">
                {errors.userName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              placeholder="パスワードを入力"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "パスワードは必須です。",
                minLength: {
                  value: 8,
                  message: "パスワードは8文字以上で入力してください。",
                },
              })}
            />
            {errors.password && (
              <p id="password-error" className="error-message">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード（確認）</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="確認のため再入力"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              {...register("confirmPassword", {
                required: "確認用パスワードは必須です。",
                validate: (v) => v === pwd || "パスワードが一致しません。",
              })}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="error-message">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="regist-button" aria-label="登録">
            登録
          </button>
        </form>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default RegistUser;
