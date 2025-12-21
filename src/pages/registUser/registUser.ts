import { z } from "zod";

// バリデーションスキーマ（フォーム入力）
export const RegistUserSchema = z
  .object({
    userId: z.string().min(1, { message: "ユーザーIDは必須です。" }),
    userName: z.string().min(1, { message: "ユーザー名は必須です。" }),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください。" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["confirmPassword"],
  });

// 型定義
export type RegistUserFormSchema = z.infer<typeof RegistUserSchema>;
