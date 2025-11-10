import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <small className="copyright">
                    © {new Date().getFullYear()} My App
                </small>
                <nav className="footer-nav" aria-label="フッターナビゲーション">
                    <a href="#" className="footer-link">利用規約</a>
                    <a href="#" className="footer-link">プライバシー</a>
                    <a href="#" className="footer-link">お問い合わせ</a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;