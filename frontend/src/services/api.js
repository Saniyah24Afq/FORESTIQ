const API_BASE_URL = "";

async function parseResponse(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `${fallbackMessage} (HTTP ${response.status})`
    );
  }

  return data;
}

async function request(url, options = {}, fallbackMessage) {
  try {
    const response = await fetch(url, options);

    return await parseResponse(
      response,
      fallbackMessage
    );
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to FORESTIQ backend. Please make sure FastAPI is running on port 8000."
      );
    }

    throw error;
  }
}


// =========================================================
// BACKEND HEALTH
// =========================================================

export async function checkBackendHealth() {
  return request(
    "/api/health",
    {},
    "Backend health check failed."
  );
}


// =========================================================
// ANALYSIS SOURCES
// =========================================================

export async function getAnalysisSources() {
  return request(
    "/api/analysis/sources",
    {},
    "Unable to load analysis sources."
  );
}


// =========================================================
// RESEARCH STATUS
// =========================================================

export async function getResearchStatus() {
  return request(
    "/api/research/status",
    {},
    "Unable to load research status."
  );
}


// =========================================================
// IMAGE ANALYSIS
// =========================================================

export async function analyzeImage({
  file,
  source = "satellite",
  latitude = "",
  longitude = "",
}) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("source", source);

  if (latitude !== null && latitude !== undefined && latitude !== "") {
    formData.append("latitude", latitude);
  }

  if (
    longitude !== null &&
    longitude !== undefined &&
    longitude !== ""
  ) {
    formData.append("longitude", longitude);
  }

  return request(
    "/api/analyze",
    {
      method: "POST",
      body: formData,
    },
    "Image analysis request failed."
  );
}


// =========================================================
// CHANGE DETECTION
// =========================================================

export async function analyzeChange({
  beforeFile,
  afterFile,
}) {
  if (!beforeFile || !afterFile) {
    throw new Error(
      "Please select both before and after images."
    );
  }

  const formData = new FormData();

  formData.append("before", beforeFile);
  formData.append("after", afterFile);

  return request(
    "/api/change-detection",
    {
      method: "POST",
      body: formData,
    },
    "Change detection request failed."
  );
}


// =========================================================
// GPS VALIDATION
// =========================================================

export async function validateLocation({
  latitude,
  longitude,
}) {
  if (
    latitude === "" ||
    latitude === null ||
    latitude === undefined ||
    longitude === "" ||
    longitude === null ||
    longitude === undefined
  ) {
    throw new Error(
      "Latitude and longitude are required."
    );
  }

  const formData = new FormData();

  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  return request(
    "/api/geographic/validate",
    {
      method: "POST",
      body: formData,
    },
    "Location validation failed."
  );
}


// =========================================================
// API BASE URL
// =========================================================

export { API_BASE_URL };