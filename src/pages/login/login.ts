import * as z from "zod";

// バリデーションスキーマ（フォーム入力）
export const userSchema = z.object({
  userId: z.string().min(1, { message: "ユーザーIDを入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

// 型定義
export type userFormSchema = z.infer<typeof userSchema>;

// バリデーションスキーマ（API レスポンス）
export const ResponseInfoSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const UserDataSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  loginCheck: z.boolean(),
  message: z.string(),
});

export const UserInfoSchema = z.object({
  responseInfo: ResponseInfoSchema,
  data: UserDataSchema,
});

export type userInfoSchema = z.infer<typeof UserInfoSchema>;
