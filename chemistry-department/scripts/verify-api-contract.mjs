// Checks that the running Django API still returns what the frontend expects.
//
//   npm run verify:api
//
// Optional environment variables:
//   NEXT_PUBLIC_DJANGO_API_URL   API base (default http://127.0.0.1:8000/api)
//   VERIFY_ADMIN_USERNAME        staff account used for the write checks
//   VERIFY_ADMIN_PASSWORD        (without both, only the read checks run)
//
// The write checks create a temporary faculty record and delete it again.

const API_BASE = (
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const ADMIN_USERNAME = process.env.VERIFY_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.VERIFY_ADMIN_PASSWORD;

// 1x1 transparent PNG
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

let passed = 0;
const failures = [];

function pass(name) {
  passed += 1;
  console.log(`  ok    ${name}`);
}

function check(condition, name, detail = "") {
  if (condition) {
    pass(name);
  } else {
    failures.push(name);
    console.log(`  FAIL  ${name}${detail ? ` - ${detail}` : ""}`);
  }

  return Boolean(condition);
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};

  if (token) headers.Authorization = `Token ${token}`;

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body:
      body && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // empty body (e.g. 204)
  }

  return { status: response.status, data };
}

function hasKeys(item, keys) {
  return keys.filter((key) => !(key in item));
}

const listContracts = [
  ["/notices/", ["id", "title"]],
  ["/resources/", ["id", "title", "file_url"]],
  [
    "/faculty/",
    [
      "id",
      "name",
      "designation",
      "qualification",
      "phd_subject",
      "phd_title",
      "description",
      "email",
      "phone",
      "order",
      "image_url",
    ],
  ],
  [
    "/events/",
    ["id", "title", "date", "location", "details", "image_url"],
  ],
  [
    "/banners/",
    ["id", "image_url", "alt_text", "order", "is_active"],
  ],
  [
    "/gallery/",
    [
      "id",
      "category",
      "title",
      "description",
      "image_url",
      "video_url",
      "date",
    ],
  ],
];

const siteSettingsKeys = [
  "head_name",
  "head_designation",
  "head_quote",
  "head_message",
  "head_image_url",
  "address",
  "phone",
  "email",
  "facebook_page_url",
  "facebook_group_url",
];

async function verifyReadEndpoints() {
  console.log("Public read endpoints");

  for (const [path, keys] of listContracts) {
    const { status, data } = await request(path);

    if (!check(status === 200, `GET ${path} returns 200`, `HTTP ${status}`)) {
      continue;
    }

    if (!check(Array.isArray(data), `GET ${path} returns a list`)) {
      continue;
    }

    if (data.length > 0) {
      const missing = hasKeys(data[0], keys);

      check(
        missing.length === 0,
        `GET ${path} items have the expected fields`,
        `missing: ${missing.join(", ")}`
      );
    }
  }

  const settings = await request("/site-settings/");

  if (check(settings.status === 200, "GET /site-settings/ returns 200", `HTTP ${settings.status}`)) {
    const missing = hasKeys(settings.data ?? {}, siteSettingsKeys);

    check(
      missing.length === 0,
      "GET /site-settings/ has the expected fields",
      `missing: ${missing.join(", ")}`
    );
  }
}

async function verifyAnonymousWritesBlocked() {
  console.log("Anonymous writes are rejected");

  for (const path of ["/faculty/", "/events/", "/banners/", "/gallery/"]) {
    const { status } = await request(path, {
      method: "POST",
      body: {},
    });

    check(
      status === 401 || status === 403,
      `POST ${path} without a token is rejected`,
      `HTTP ${status}`
    );
  }

  const patch = await request("/site-settings/", {
    method: "PATCH",
    body: { phone: "0" },
  });

  check(
    patch.status === 401 || patch.status === 403,
    "PATCH /site-settings/ without a token is rejected",
    `HTTP ${patch.status}`
  );
}

function pngForm(fields) {
  const form = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  form.append(
    "image",
    new Blob([Buffer.from(PNG_BASE64, "base64")], {
      type: "image/png",
    }),
    "verify.png"
  );

  return form;
}

async function verifyAuthenticatedWrites() {
  console.log("Authenticated write checks");

  const login = await request("/auth/login/", {
    method: "POST",
    body: { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
  });

  if (!check(login.status === 200 && login.data?.token, "Admin login", `HTTP ${login.status}`)) {
    return;
  }

  const token = login.data.token;

  // Faculty image upload -> image_url -> remove image -> delete
  const created = await request("/faculty/", {
    method: "POST",
    token,
    body: pngForm({
      name: "API verify (temporary)",
      designation: "Test",
      phd_subject: "Chemistry",
    }),
  });

  if (!check(created.status === 201, "Faculty image upload", `HTTP ${created.status} ${JSON.stringify(created.data)}`)) {
    return;
  }

  const id = created.data.id;

  check(
    typeof created.data.image_url === "string" &&
      created.data.image_url.length > 0,
    "Faculty upload response contains image_url"
  );

  check(
    created.data.phd_subject === "Chemistry",
    "Faculty phd_subject is saved"
  );

  const cleared = await request(`/faculty/${id}/`, {
    method: "PUT",
    token,
    body: (() => {
      const form = new FormData();
      form.append("name", "API verify (temporary)");
      form.append("designation", "Test");
      form.append("image", "");
      return form;
    })(),
  });

  check(
    cleared.status === 200 && cleared.data?.image_url === null,
    "Faculty image can be removed",
    `HTTP ${cleared.status}`
  );

  const removed = await request(`/faculty/${id}/`, {
    method: "DELETE",
    token,
  });

  check(
    removed.status === 204,
    "Faculty cleanup delete",
    `HTTP ${removed.status}`
  );

  // Gallery validation rules
  const videoWithoutLink = await request("/gallery/", {
    method: "POST",
    token,
    body: { category: "video", title: "API verify" },
  });

  check(
    videoWithoutLink.status === 400,
    "Gallery video without a link is rejected",
    `HTTP ${videoWithoutLink.status}`
  );

  const photoWithoutImage = await request("/gallery/", {
    method: "POST",
    token,
    body: { category: "photo", title: "API verify" },
  });

  check(
    photoWithoutImage.status === 400,
    "Gallery photo without an image is rejected",
    `HTTP ${photoWithoutImage.status}`
  );
}

async function main() {
  console.log(`API: ${API_BASE}\n`);

  try {
    await verifyReadEndpoints();
    await verifyAnonymousWritesBlocked();

    if (ADMIN_USERNAME && ADMIN_PASSWORD) {
      await verifyAuthenticatedWrites();
    } else {
      console.log(
        "\nSkipped authenticated checks (set VERIFY_ADMIN_USERNAME and VERIFY_ADMIN_PASSWORD to run them)."
      );
    }
  } catch (error) {
    console.error(
      `\nCould not reach the API at ${API_BASE}: ${
        error instanceof Error ? error.message : error
      }`
    );
    process.exit(1);
  }

  console.log(
    `\n${passed} passed, ${failures.length} failed`
  );

  if (failures.length > 0) process.exit(1);
}

main();
