const clientConfig = {
  API_URL: import.meta.env.VITE_API_URL, // http://localhost:2555/api/v1
  ASSET_URL: import.meta.env.VITE_API_URL.replace("/api/v1", ""), // http://localhost:2555
  APP_NAME: import.meta.env.VITE_APP_NAME,

  PROJECT_ENV: import.meta.env.VITE_PROJECT_ENV,
};

export default clientConfig;
