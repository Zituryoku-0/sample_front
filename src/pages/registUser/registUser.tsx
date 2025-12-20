import { useState } from "react";
import "./registUser.css";
import { useForm } from "react-hook-form";
import { RegistUserSchema, type RegistUserFormSchema } from "./registUser";
import Loading from "../loading/loading";
import { UserInfoSchema } from "../login/login";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/userInfoStore";
import { login } from "../../slices/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

function RegistUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistUserFormSchema>({
    resolver: zodResolver(RegistUserSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      userId: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegistUserFormSchema) => {
    setError(null);
    let responseData;
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
      // OKでもNGでもJSONを取得してパースする
      const rawData = await response.json();
      responseData = UserInfoSchema.safeParse(rawData);
      // フォームのリセット
      reset();
      if (!response.ok) {
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
        setError("ユーザー登録に失敗しました。");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (responseData?.data?.responseInfo.code === "400") {
          setError(
            responseData?.data?.data.message || "ユーザーIDが重複しています。"
          );
        } else {
          setError(
            responseData?.data?.data.message ||
              "サーバー内部でエラーが発生しました。"
          );
        }
      } else {
        setError("ユーザー登録中にエラーが発生しました。");
      }
    } finally {
      setLoading(false);
    }
  };
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
              {...register("userId")}
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
              {...register("userName")}
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
              {...register("password")}
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
              {...register("confirmPassword")}
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
