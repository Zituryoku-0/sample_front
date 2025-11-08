import './App.css'
import { useEffect, useState } from 'react';
import type { UserInfo } from './interface/userInfo';


function App() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/login", {
          method: "GET",
          credentials: "include", // ←重要
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json())
          .then((data: UserInfo) => {
            console.log(data);
          });
        console.log(response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // 空の依存配列は、コンポーネントマウント時に一度だけ実行されることを意味します

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  return (
    <>
    </>
  );
}

export default App
