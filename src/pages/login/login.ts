import * as z from 'zod';


// バリデーションスキーマ
export const userSchema = z.object({
  userId: z.string().min(1, {message: 'ユーザーIDを入力してください'}),
  password: z.string().min(8, 'パスワードを入力してください')
});

// 型定義
export type userFormSchema = z.infer<typeof userSchema>;