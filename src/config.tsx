const config = {
  localUrl: "http://localhost:6578",
  prodUrl: "https://server-hackathon-2025.onrender.com:6578",
};

const BASE_URL =
  window.location.hostname === "localhost"
    ? config.localUrl
    : config.prodUrl;

export default BASE_URL;