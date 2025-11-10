import * as z from 'zod';


// バリデーションスキーマ（フォーム入力）
export const userSchema = z.object({
  userId: z.string().min(1, {message: 'ユーザーIDを入力してください'}),
  password: z.string().min(8, {message: 'パスワードを入力してください'})
});

// 型定義
export type userFormSchema = z.infer<typeof userSchema>;

// バリデーションスキーマ（API レスポンス）
export const UserInfoSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  loginCheck: z.boolean()
});