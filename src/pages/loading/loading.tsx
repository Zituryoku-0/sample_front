// src/components/Loading.tsx
import React from "react";

const Loading: React.FC = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.loader}></div>
            <p style={styles.text}>読み込み中...</p>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "#fff"
    },
    loader: {
        width: "50px",
        height: "50px",
        border: "6px solid #fff",
        borderTop: "6px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    text: {
        marginTop: "12px",
        fontSize: "18px",
    }
};

export default Loading;