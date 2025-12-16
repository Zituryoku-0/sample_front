import "./footer.css";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <small className="copyright">
                    © {new Date().getFullYear()} My App
                </small>
                <nav className="footer-nav" aria-label="フッターナビゲーション">
                    {/* TODO: 利用規約ページへのリンク先を実装予定 */}
                    <a href="#" className="footer-link">利用規約</a>
                    {/* TODO: プライバシーポリシーページへのリンク先を実装予定 */}
                    <a href="#" className="footer-link">プライバシー</a>
                    {/* TODO: お問い合わせページへのリンク先を実装予定 */}
                    <a href="#" className="footer-link">お問い合わせ</a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;