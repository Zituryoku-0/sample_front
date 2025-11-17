import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/userInfoStore";
import { logout } from "../../slices/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const Home = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // storeから値を読み込む
  const user = useSelector((state: RootState) => state.auth.user);

  const handleClick = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return <p>未ログインです。</p>;
  };
  return (
    <div>
      <p>ようこそ {user.userName} さん（ID: {user.userId}）</p>
      <button type="button" onClick={handleClick}>ログアウト</button>
    </div>
  );
};