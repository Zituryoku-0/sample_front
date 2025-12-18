import { z } from 'zod';

// バリデーションスキーマ（フォーム入力）
export const registUserSchema = z.object({
  userId: z.string().min(1, {message: 'ユーザーIDを入力してください'}),
  userName: z.string().min(1, {message: 'ユーザー名を入力してください'}),
  password: z.string().min(1, {message: 'パスワードを入力してください'}),
  confirmPassword: z.string().min(1, {message: 'パスワード（確認）を入力してください'}),
});

// 型定義
export type registUserFormSchema = z.infer<typeof registUserSchema>;