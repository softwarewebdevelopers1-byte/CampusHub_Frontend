import React, { useEffect, useState } from "react";
import styles from "../components.css.styles/CampusHub_videos.module.css";

const API_BASE = "http://localhost:8000";

const CampusHubVideo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchVideos = async (term = "") => {
    setLoading(true);
    setError(null);
    setSearchPerformed(Boolean(term.trim()));
    setSelectedVideo(null);

    try {
      const response = await fetch(`${API_BASE}/api/get/lecturer/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: term }),
      });

      if (!response.ok) {
        throw new Error("Unable to load videos");
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

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    await fetchVideos(searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (error) setError(null);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      {selectedVideo && (
        <div className={styles.videoModal} onClick={handleCloseVideo}>
          <div
            className={styles.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseVideo}>
              x
            </button>
            <div className={styles.videoPlayerContainer}>
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                onPlay={handlePlayVideo}
                onPause={handlePauseVideo}
                className={styles.videoPlayer}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.videoDetails}>
              <h2 className={styles.videoDetailTitle}>
                {selectedVideo.title || selectedVideo.unitName}
              </h2>
              <p className={styles.videoDetailDescription}>
                {selectedVideo.description}
              </p>
              <div className={styles.videoDetailMeta}>
                <span className={styles.detailUploader}>
                  Uploaded by: {selectedVideo.email || "Unknown"}
                </span>
                <span className={styles.detailViews}>
                  {selectedVideo.views || 0} views
                </span>
                <span className={styles.detailDate}>
                  {formatDate(selectedVideo.uploadDate)}
                </span>
              </div>
              {selectedVideo.courseTitle && (
                <div className={styles.videoCourseInfo}>
                  <span className={styles.courseTag}>
                    Course: {selectedVideo.courseTitle}
                  </span>
                  {selectedVideo.unitCode && (
                    <span className={styles.unitTag}>
                      Unit Code: {selectedVideo.unitCode}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <p>Try different keywords or browse the latest lecturer uploads.</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <>
            <h2 className={styles.resultsTitle}>
              {searchPerformed
                ? `Search Results for "${searchQuery}"`
                : "Latest Lecturer Videos"}{" "}
              ({videos.length} {videos.length === 1 ? "video" : "videos"})
            </h2>
            <div className={styles.videoGrid}>
              {videos.map((video, index) => (
                <div
                  key={video._id || `${video.videoUrl}-${index}`}
                  className={styles.videoCard}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className={styles.thumbnailContainer}>
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.unitName}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <div className={styles.thumbnailPlaceholder}>
                        <span>{">"}</span>
                      </div>
                    )}
                    {video.duration && (
                      <span className={styles.duration}>{video.duration}</span>
                    )}
                    <div className={styles.playOverlay}>
                      <span className={styles.playIcon}>{">"}</span>
                    </div>
                  </div>
                  <div className={styles.videoInfo}>
                    <h3 className={styles.videoTitle}>
                      {video.title || video.unitName || "Untitled Video"}
                    </h3>
                    <p className={styles.videoDescription}>
                      {video.description ||
                        `${video.unitCode || ""} ${video.courseTitle || ""}`}
                    </p>
                    <div className={styles.videoMeta}>
                      <span className={styles.uploader}>
                        {video.email || "Unknown"}
                      </span>
                      <span className={styles.views}>
                        {video.views || 0} views
                      </span>
                      <span className={styles.uploadDate}>
                        {formatDate(video.uploadDate)}
                      </span>
                    </div>
                    {video.unitCode && (
                      <span className={styles.unitCodeBadge}>
                        {video.unitCode}
                      </span>
                    )}
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
