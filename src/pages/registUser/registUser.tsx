import React, { useState } from 'react';
import './registUser.css';
import { useForm } from 'react-hook-form';
import Loading from '../loading/loading';

type RegistForm = {
	userId: string;
	password: string;
	confirmPassword: string;
};

function RegistUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<RegistForm>({
		mode: 'onBlur',
		defaultValues: { userId: '', password: '', confirmPassword: '' },
	});

	const onSubmit = async (data: RegistForm) => {
		setError(null);
		if (data.password !== data.confirmPassword) {
			setError('パスワードが一致しません。');
			return;
		}
		try {
			setLoading(true);
			// ここでAPI呼び出しを行う予定（ダミー実装）
			await new Promise((r) => setTimeout(r, 600));
			// 成功時の処理（例: リダイレクトや通知）
			alert('登録が完了しました（ダミー）。');
			reset();
		} catch (e) {
			setError('登録中にエラーが発生しました。');
            setError(e.toString());
		} finally {
			setLoading(false);
		}
	};

	const pwd = watch('password');

	return (
		<div className="regist-container">
			<div className="regist-box" aria-labelledby="regist-title">
				<h1 id="regist-title" className="regist-title">ユーザー登録</h1>

				<form className="regist-form" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="form-group">
						<label htmlFor="userId">ユーザーID</label>
						<input
							id="userId"
							type="text"
							placeholder="ユーザーIDを入力"
							autoComplete="username"
							aria-invalid={!!errors.userId}
							aria-describedby={errors.userId ? 'userId-error' : undefined}
							{...register('userId', { required: 'ユーザーIDは必須です。' })}
						/>
						{errors.userId && (
							<p id="userId-error" className="error-message">{errors.userId.message}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">パスワード</label>
						<input
							id="password"
							type="password"
							placeholder="パスワードを入力"
							autoComplete="new-password"
							aria-invalid={!!errors.password}
							aria-describedby={errors.password ? 'password-error' : undefined}
							{...register('password', {
								required: 'パスワードは必須です。',
								minLength: { value: 8, message: 'パスワードは8文字以上で入力してください。' },
							})}
						/>
						{errors.password && (
							<p id="password-error" className="error-message">{errors.password.message}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">パスワード（確認）</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="確認のため再入力"
							autoComplete="new-password"
							aria-invalid={!!errors.confirmPassword}
							aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
							{...register('confirmPassword', {
								required: '確認用パスワードは必須です。',
								validate: (v) => v === pwd || 'パスワードが一致しません。',
							})}
						/>
						{errors.confirmPassword && (
							<p id="confirmPassword-error" className="error-message">{errors.confirmPassword.message}</p>
						)}
					</div>

					{error && <div className="error-message">{error}</div>}

					<button type="submit" className="regist-button" aria-label="登録">登録</button>
				</form>
			</div>
			{loading && <Loading />}
		</div>
	);
}

export default RegistUser;
