console.log("VITE_API_BASE =", import.meta.env.VITE_API_BASE);

const RAW_BASE = import.meta.env.VITE_API_BASE || "";
const BASE = RAW_BASE.replace(/\/+$/, ""); // sonda / varsa sil

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    : { Accept: "application/json" };
}

/* =========================
   AUTH
========================= */

export async function register(payload) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kayıt olunamadı");

  // Bazı backend'ler register'da token döndürmeyebilir
  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function login(payload) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Giriş yapılamadı");

  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/* =========================
   BOOKS (TOKEN ZORUNLU)
========================= */

export async function getBooks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${BASE}/api/books?${qs}` : `${BASE}/api/books`;

  const res = await fetch(url, {
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kitaplar alınamadı");
  return data;
}

export async function addBook(payload) {
  const res = await fetch(`${BASE}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kitap eklenemedi");
  return data;
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE}/api/books/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kitap silinemedi");
  return data;
}

export async function updateStatus(id, durum) {
  const res = await fetch(`${BASE}/api/books/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ durum }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Durum güncellenemedi");
  return data;
}

export async function updateRating(id, puan) {
  const res = await fetch(`${BASE}/api/books/${id}/rating`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ puan }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Puan güncellenemedi");
  return data;
}

export async function getStats() {
  const res = await fetch(`${BASE}/api/books/stats`, {
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Stats alınamadı");
  return data;
}