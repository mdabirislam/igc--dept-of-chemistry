const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000/api";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error(
    "Missing ADMIN_USERNAME or ADMIN_PASSWORD environment variables."
  );
  console.error("");
  console.error("Example:");
  console.error(
    "  set ADMIN_USERNAME=admin"
  );
  console.error(
    "  set ADMIN_PASSWORD=your-password"
  );
  console.error(
    "  npm run verify:api"
  );
  process.exit(1);
}

const createdIds = {
  events: [],
  faculty: [],
  notices: [],
  resources: [],
};

let token = null;

function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  if (
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  let data = null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text || null;
  }

  return {
    response,
    data,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function logPass(message) {
  console.log(`PASS  ${message}`);
}

function logInfo(message) {
  console.log(`      ${message}`);
}

async function login() {
  const { response, data } = await request("/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }),
  });

  assert(
    response.ok,
    `Admin login failed: HTTP ${response.status} ${JSON.stringify(data)}`
  );

  assert(
    typeof data?.token === "string" && data.token.length > 0,
    "Login response does not contain a valid token."
  );

  assert(
    data?.user?.is_staff === true,
    "Login response user is not marked as staff."
  );

  token = data.token;

  logPass("Admin login");
}

async function verifyPublicRead(endpoint, name) {
  const previousToken = token;
  token = null;

  const { response, data } = await request(endpoint);

  token = previousToken;

  assert(
    response.ok,
    `${name} public GET failed: HTTP ${response.status}`
  );

  assert(
    Array.isArray(data),
    `${name} GET response is not an array.`
  );

  logPass(`${name} public GET`);
}

async function verifyResource(name, endpoint, payload) {
  let createdId;

  const createResult = await request(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  assert(
    createResult.response.status === 201,
    `${name} POST failed: HTTP ${createResult.response.status} ${JSON.stringify(
      createResult.data
    )}`
  );

  assert(
    createResult.data?.id !== undefined &&
      createResult.data?.id !== null,
    `${name} POST response does not contain id.`
  );

  createdId = createResult.data.id;
  createdIds[endpoint.replace(/\//g, "")]?.push?.(createdId);

  logPass(`${name} POST`);

  const getResult = await request(`${endpoint}${createdId}/`);

  assert(
    getResult.response.ok,
    `${name} detail GET failed: HTTP ${getResult.response.status}`
  );

  assert(
    getResult.data?.id === createdId,
    `${name} detail GET returned unexpected id.`
  );

  logPass(`${name} detail GET`);

  const updatePayload = {};

  if (name === "Event") {
    updatePayload.title = "API Contract Test Updated Event";
  }

  if (name === "Faculty") {
    updatePayload.name = "API Contract Test Updated Faculty";
  }

  if (name === "Notice") {
    updatePayload.title = "API Contract Test Updated Notice";
  }

  if (name === "Resource") {
    updatePayload.title = "API Contract Test Updated Resource";
  }

  const updateResult = await request(`${endpoint}${createdId}/`, {
    method: "PATCH",
    body: JSON.stringify(updatePayload),
  });

  assert(
    updateResult.response.ok,
    `${name} PATCH failed: HTTP ${updateResult.response.status} ${JSON.stringify(
      updateResult.data
    )}`
  );

  assert(
    updateResult.data?.id === createdId,
    `${name} PATCH response returned unexpected id.`
  );

  logPass(`${name} PATCH`);

  const deleteResult = await request(`${endpoint}${createdId}/`, {
    method: "DELETE",
  });

  assert(
    deleteResult.response.status === 204,
    `${name} DELETE failed: HTTP ${deleteResult.response.status}`
  );

  logPass(`${name} DELETE`);

  const verifyDeleteResult = await request(`${endpoint}${createdId}/`);

  assert(
    verifyDeleteResult.response.status === 404,
    `${name} deleted object is still accessible: HTTP ${verifyDeleteResult.response.status}`
  );

  logPass(`${name} DELETE verification`);
}

async function verifyUnauthorizedWrite(endpoint, name, payload) {
  const previousToken = token;
  token = null;

  const { response } = await request(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  token = previousToken;

  assert(
    response.status === 401 || response.status === 403,
    `${name} unauthorized POST unexpectedly returned HTTP ${response.status}`
  );

  logPass(`${name} unauthorized write protection`);
}

async function logout() {
  const { response } = await request("/auth/logout/", {
    method: "POST",
  });

  assert(
    response.status === 204 || response.ok,
    `Admin logout failed: HTTP ${response.status}`
  );

  logPass("Admin logout");
}

async function main() {
  console.log("");
  console.log("=== Chemistry Department API Contract Verification ===");
  console.log("");
  console.log(`API: ${API_BASE_URL}`);
  console.log("");

  try {
    await verifyPublicRead("/events/", "Events");
    await verifyPublicRead("/faculty/", "Faculty");
    await verifyPublicRead("/notices/", "Notices");
    await verifyPublicRead("/resources/", "Resources");

    console.log("");

    await verifyUnauthorizedWrite(
      "/events/",
      "Events",
      {
        title: "Unauthorized API Contract Test",
        date: "2026-01-01",
      }
    );

    await verifyUnauthorizedWrite(
      "/faculty/",
      "Faculty",
      {
        name: "Unauthorized API Contract Test",
        designation: "Lecturer",
      }
    );

    await verifyUnauthorizedWrite(
      "/notices/",
      "Notices",
      {
        title: "Unauthorized API Contract Test",
        category: "general",
      }
    );

    await verifyUnauthorizedWrite(
      "/resources/",
      "Resources",
      {
        title: "Unauthorized API Contract Test",
      }
    );

    console.log("");

    await login();

    await verifyResource(
      "Event",
      "/events/",
      {
        title: "API Contract Test Event",
        date: "2026-01-01",
        location: "Chemistry Department",
        details: "Temporary API contract test data.",
      }
    );

    await verifyResource(
      "Faculty",
      "/faculty/",
      {
        name: "API Contract Test Faculty",
        designation: "Lecturer",
        qualification: "M.Sc.",
      }
    );

    await verifyResource(
      "Notice",
      "/notices/",
      {
        title: "API Contract Test Notice",
        category: "general",
        details: "Temporary API contract test data.",
      }
    );

    await verifyResource(
      "Resource",
      "/resources/",
      {
        title: "API Contract Test Resource",
      }
    );

    await logout();

    console.log("");
    console.log("==============================================");
    console.log("ALL API CONTRACT TESTS PASSED");
    console.log("==============================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("API CONTRACT TEST FAILED");
    console.error("==============================================");
    console.error("");
    console.error(
      error instanceof Error ? error.message : error
    );
    console.error("");

    if (token) {
      try {
        await logout();
      } catch {
        // Ignore cleanup logout failure.
      }
    }

    process.exit(1);
  }
}

main();