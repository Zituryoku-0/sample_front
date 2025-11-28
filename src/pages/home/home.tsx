import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/userInfoStore";
import { logout } from "../../slices/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const Home = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // storeから値を読み込む
  const user = useSelector((state: RootState) => state.auth.user);

  // 未認証時のリダイレクト
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleClick = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return null; // リダイレクト中は何も表示しない
  };
  return (
    <div>
      <p>ようこそ {user.userName} さん（ID: {user.userId}）</p>
      <button type="button" onClick={handleClick}>ログアウト</button>
    </div>
  );
};