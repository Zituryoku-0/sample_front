import "./header.css";

function Header() {
    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="brand">
                    <span className="logo" aria-hidden="true">●</span>
                    <span className="app-name">My App</span>
                </div>
                {/* 必要になったら右側にボタン等を追加できます */}
                {/* <button className="ghost-btn" type="button">ヘルプ</button> */}
            </div>
        </header>
    );
}

export default Header;