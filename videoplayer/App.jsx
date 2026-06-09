import React, { useState, useEffect, useRef } from "react";

export default function App() {

  const [videoUrl, setVideoUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const playerRef = useRef(null);

  const loadVideo = async () => {

    const res = await fetch("http://localhost:5000/load", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        url: videoUrl
      })
    });

    const data = await res.json();

    setTitle(data.title);
    setStreamUrl(data.stream_url);

    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/history");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const play = () => playerRef.current.play();

  const pause = () => playerRef.current.pause();

  const replay = () => {
    playerRef.current.currentTime = 0;
    playerRef.current.play();
  };

  const skip = () => {
    playerRef.current.currentTime += 10;
  };

  return (
    <div
      style={{
        minHeight:"100vh",
        background: darkMode ? "#111" : "#fff",
        color: darkMode ? "#fff" : "#000"
      }}
    >

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          fontSize:"30px",
          margin:"10px"
        }}
      >
        ☰
      </button>

      {menuOpen && (
        <div
          style={{
            width:"250px",
            position:"fixed",
            top:0,
            left:0,
            height:"100%",
            background:"#222",
            padding:"20px"
          }}
        >

          <h3>Load URL</h3>

          <input
            value={videoUrl}
            onChange={(e)=>setVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL"
            style={{
              width:"100%",
              padding:"10px"
            }}
          />

          <button
            onClick={loadVideo}
            style={{
              marginTop:"10px"
            }}
          >
            Load
          </button>

          <hr />

          <button
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <hr />

          <h3>Watch History</h3>

          {history.map((item,index)=>(
            <div key={index}>
              {item.title}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display:"flex",
          justifyContent:"center",
          marginTop:"30px"
        }}
      >
        <div
          style={{
            width:"60%",
            textAlign:"center"
          }}
        >

          <h2>{title}</h2>

          <video
            ref={playerRef}
            controls
            src={streamUrl}
            style={{
              width:"100%",
              borderRadius:"10px"
            }}
          />

          <div
            style={{
              marginTop:"15px",
              display:"flex",
              justifyContent:"center",
              gap:"10px",
              flexWrap:"wrap"
            }}
          >

            <button onClick={play}>▶</button>

            <button onClick={pause}>⏸</button>

            <button onClick={replay}>↺</button>

            <button onClick={skip}>⏭ 10s</button>

            <button
              onClick={()=>{
                playerRef.current.playbackRate = 1.25;
              }}
            >
              1.25x
            </button>

            <button
              onClick={()=>{
                playerRef.current.playbackRate = 1.5;
              }}
            >
              1.5x
            </button>

            <button
              onClick={()=>{
                const a = document.createElement("a");
                a.href = streamUrl;
                a.download = title;
                a.click();
              }}
            >
              Download
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}