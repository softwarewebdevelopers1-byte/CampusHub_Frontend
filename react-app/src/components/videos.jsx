import React, { useState } from "react";
import styles from "../components.css.styles/CampusHub_videos.module.css";

const CampusHubVideo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch("http://localhost:8000/api/search-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.message || "Failed to fetch videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>CampusHub</h1>
        <p className={styles.subtitle}>
          Discover educational videos from your campus community
        </p>
      </header>

      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for videos..."
            className={styles.searchInput}
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <div className={styles.resultsSection}>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading videos...</p>
          </div>
        )}

        {!loading && searchPerformed && videos.length === 0 && !error && (
          <div className={styles.noResults}>
            <p>No videos found for "{searchQuery}"</p>
            <p>Try different keywords or browse all videos</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <>
            <h2 className={styles.resultsTitle}>
              Search Results for "{searchQuery}"
            </h2>
            <div className={styles.videoGrid}>
              {videos.map((video) => (
                <div key={video.id} className={styles.videoCard}>
                  <div className={styles.thumbnailContainer}>
                    <img
                      src={video.thumbnail || "/default-thumbnail.jpg"}
                      alt={video.title}
                      className={styles.thumbnail}
                    />
                    {video.duration && (
                      <span className={styles.duration}>{video.duration}</span>
                    )}
                  </div>
                  <div className={styles.videoInfo}>
                    <h3 className={styles.videoTitle}>{video.title}</h3>
                    <p className={styles.videoDescription}>
                      {video.description}
                    </p>
                    <div className={styles.videoMeta}>
                      <span className={styles.uploader}>{video.uploader}</span>
                      <span className={styles.views}>{video.views} views</span>
                      <span className={styles.uploadDate}>
                        {video.uploadDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampusHubVideo;
