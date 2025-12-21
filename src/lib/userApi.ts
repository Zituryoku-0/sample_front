import z from "zod";
import type { RegistUserFormSchema } from "../pages/registUser/registUser";
import { apiClient } from "./apiClient";
import type { UserFormSchema } from "../pages/login/login";

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

export type UserInfoSchema = z.infer<typeof UserInfoSchema>;

// ユーザー登録API
export const fetchRegistUser = async (
  req: RegistUserFormSchema
): Promise<UserInfoSchema> => {
  const response = await apiClient.post<UserInfoSchema>("/registUser", req);
  return response.data;
};

// ログインAPI
export const fetchLoginUser = async (
  req: UserFormSchema
): Promise<UserInfoSchema> => {
  const response = await apiClient.post<UserInfoSchema>("/login", req);
  return response.data;
};
