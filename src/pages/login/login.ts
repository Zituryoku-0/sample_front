import * as z from "zod";

// バリデーションスキーマ（フォーム入力）
export const userSchema = z.object({
  userId: z.string().min(1, { message: "ユーザーIDを入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください。" }),
});

// 型定義
export type UserFormSchema = z.infer<typeof userSchema>;
