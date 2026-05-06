import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPost() {
      try {
        setStatus("loading");
        const response = await fetch(
          "https://api.freeapi.app/api/v1/public/youtube/videos",
          { signal: controller.signal }
        );
        const data = await response.json();
        setPosts(data.data.data);
        setStatus("success");
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setStatus("error");
        }
      }
    }
    loadPost();

    return () => {
      controller.abort()
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">YouTube Videos</h1>

      {status === "loading" && <p className="text-blue-500">Loading...</p>}
      {status === "error" && <p className="text-red-500">Something went wrong!</p>}

      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((video) => (
            <div
              key={video.items.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={video.items.snippet.thumbnails.medium.url}
                alt={video.items.snippet.title}
                className="w-full rounded-lg"
              />
              <h3 className="mt-2 font-semibold text-lg line-clamp-2">
                {video.items.snippet.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {video.items.snippet.channelTitle} •{" "}
                {Number(video.items.statistics.viewCount).toLocaleString()} views
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App