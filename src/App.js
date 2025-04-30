import React, { useState, useEffect } from "react";

export default function App() {
  // 50音表（列順に並べ替え - 逆順：右側にあ行）
  const kanaTable = [
    ["ん", "わ", "ら", "や", "ま", "は", "な", "た", "さ", "か", "あ"],
    ["　", "　", "り", "　", "み", "ひ", "に", "ち", "し", "き", "い"],
    ["　", "　", "る", "ゆ", "む", "ふ", "ぬ", "つ", "す", "く", "う"],
    ["　", "　", "れ", "　", "め", "へ", "ね", "て", "せ", "け", "え"],
    ["　", "を", "ろ", "よ", "も", "ほ", "の", "と", "そ", "こ", "お"]
  ];

  const [status, setStatus] = useState({});
  const [cellSize, setCellSize] = useState(48); // デフォルトのセルサイズ
  const [containerWidth, setContainerWidth] = useState(0);

  // 画面サイズに応じてセルサイズを調整
  useEffect(() => {
    const calculateSize = () => {
      const padding = 48; // コンテナのパディング(左右)
      const gap = 4; // セル間のギャップ
      const columns = 11; // 最大列数
      const availableWidth = window.innerWidth - padding;
      const calculatedSize = Math.floor((availableWidth - (columns - 1) * gap) / columns);
      
      // 最小サイズと最大サイズを制限
      const newSize = Math.max(30, Math.min(48, calculatedSize));
      setCellSize(newSize);
      setContainerWidth(window.innerWidth);
    };

    // 初期計算
    calculateSize();
    
    // リサイズイベントのリスナー
    window.addEventListener('resize', calculateSize);
    
    // クリーンアップ
    return () => window.removeEventListener('resize', calculateSize);
  }, []);


  const handleClick = (kana) => {
    if (kana === "　") return;
    
    setStatus((prev) => {
      const current = prev[kana] || 0;
      // 0→1→2で止まる (2の場合は変化なし)
      return {
        ...prev,
        [kana]: current === 2 ? 2 : current + 1,
      };
    });
  };

  const handleUndo = (kana) => {
    if (kana === "　") return;
    
    setStatus((prev) => {
      const current = prev[kana] || 0;
      // 一つ前の状態に戻す (最小は0)
      return {
        ...prev,
        [kana]: Math.max(0, current - 1),
      };
    });
  };

  const handleReset = () => {
    setStatus({});
  };

  // ボタン色の切り替え
  const getButtonStyle = (kana) => {
    if (kana === "　") return {
      backgroundColor: "transparent",
      cursor: "default",
      border: "none",
      boxShadow: "none"
    };
    
    const state = status[kana] || 0;
    if (state === 1) return { 
      backgroundColor: "#fef08a",  // 黄色
      color: "#000000",
      opacity: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      border: "1px solid #e5d66b",
      borderRadius: "8px",
      cursor: "pointer"
    };
    if (state === 2) return { 
      backgroundColor: "#f5f5f5",  // より薄い灰色
      color: "#cccccc",            // 薄い文字色
      opacity: 0.5,                // 半透明
      boxShadow: "none",
      border: "1px solid #e5e5e5",
      borderRadius: "8px",
      cursor: "pointer"
    };
    return { 
      backgroundColor: "#ffffff",     // 通常: 白背景
      color: "#000000",
      opacity: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      border: "1px solid #cccccc",
      borderRadius: "8px",
      cursor: "pointer"
    };
  };

  // カウント機能
  const getStatusCounts = () => {
    const counts = { count0: 0, count1: 0, count2: 0, total: 0 };
    
    kanaTable.flat().forEach(kana => {
      if (kana !== "　") {
        counts.total++;
        const state = status[kana] || 0;
        if (state === 0) counts.count0++;
        else if (state === 1) counts.count1++;
        else if (state === 2) counts.count2++;
      }
    });
    
    return counts;
  };

  const counts = getStatusCounts();

  const containerStyle = {
    padding: "12px",
    fontFamily: "sans-serif",
    maxWidth: "100%",
    margin: "0 auto",
    boxSizing: "border-box"
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px"
  };

  const gridContainerStyle = {
    marginBottom: "24px",
    overflowX: "auto",
    width: "100%"
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "8px",
    gap: "4px",
    flexWrap: "nowrap"
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  };

  const statsContainerStyle = {
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px"
  };

  const statsRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    justifyContent: "center"
  };

  const statItemStyle = {
    display: "flex",
    alignItems: "center"
  };

  const colorBoxStyle = {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    marginRight: "8px",
    border: "1px solid #d1d5db"
  };

  const resetButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>50音カウンター</h1>
      
      <div style={gridContainerStyle}>
        {kanaTable.map((row, rowIndex) => (
          <div key={rowIndex} style={rowStyle}>
            {row.map((kana, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "4px", 
                width: `${cellSize}px`, 
                height: `${cellSize + 24}px`
              }}>
                <button
                  onClick={() => handleClick(kana)}
                  style={{
                    ...buttonStyle,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    fontSize: `${Math.max(16, Math.floor(cellSize * 0.4))}px`,
                    ...getButtonStyle(kana)
                  }}
                  disabled={kana === "　"}
                >
                  {kana}
                </button>
                {kana !== "　" ? (
                  <button
                    onClick={() => handleUndo(kana)}
                    style={{
                      width: `${Math.floor(cellSize * 0.5)}px`,
                      height: "20px",
                      fontSize: "12px",
                      margin: "0 auto",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      visibility: (status[kana] || 0) > 0 ? "visible" : "hidden"
                    }}
                  >
                    ↩
                  </button>
                ) : (
                  <div style={{ height: "20px" }}></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div style={statsContainerStyle}>
        <div style={statsRowStyle}>
          <div style={statItemStyle}>
            <div style={{...colorBoxStyle, backgroundColor: "#ffffff"}}></div>
            <span>0回: {counts.count0}</span>
          </div>
          <div style={statItemStyle}>
            <div style={{...colorBoxStyle, backgroundColor: "#fef08a"}}></div>
            <span>1回: {counts.count1}</span>
          </div>
          <div style={statItemStyle}>
            <div style={{...colorBoxStyle, backgroundColor: "#f5f5f5", opacity: 0.5}}></div>
            <span>2回: {counts.count2}</span>
          </div>
          <div style={statItemStyle}>
            <span>進捗: {Math.round(((counts.count1 + counts.count2) / counts.total) * 100)}%</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <button 
          style={{
            ...resetButtonStyle,
            fontSize: `${Math.max(14, Math.floor(cellSize * 0.3))}px`,
          }}
          onClick={handleReset}
          onMouseOver={(e) => e.target.style.backgroundColor = "#d1d5db"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#e5e7eb"}
        >
          リセット
        </button>
        <button 
          style={{
            ...resetButtonStyle,
            backgroundColor: "#fee2e2",
            display: counts.count1 + counts.count2 === counts.total ? "block" : "none",
            fontSize: `${Math.max(14, Math.floor(cellSize * 0.3))}px`,
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#fecaca"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#fee2e2"}
        >
          完了！
        </button>
      </div>
    </div>
  );
}