"use client";

import { useState, useCallback } from "react";
import useUpload from "@/utils/useUpload";

export default function UploadPage() {
  const [tab, setTab] = useState("file"); // "file" | "url"
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [upload, { loading }] = useUpload();

  const onFileChange = useCallback((e) => {
    setResultUrl("");
    setSuccess(false);
    setError(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
  }, []);

  const onSubmit = useCallback(async () => {
    setError(null);
    setSuccess(false);
    setResultUrl("");
    setMimeType("");

    try {
      if (tab === "file") {
        if (!file) {
          setError("Please choose a file first");
          return;
        }
        const { url: u, mimeType: m, error: err } = await upload({ file });
        if (err) {
          setError(err);
          return;
        }
        setResultUrl(u || "");
        setMimeType(m || "");
        setSuccess(true);
      } else {
        const trimmed = (url || "").trim();
        if (!trimmed) {
          setError("Paste a direct link to a file");
          return;
        }
        const {
          url: u,
          mimeType: m,
          error: err,
        } = await upload({ url: trimmed });
        if (err) {
          setError(err);
          return;
        }
        setResultUrl(u || "");
        setMimeType(m || "");
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setError("Upload failed");
    }
  }, [tab, file, url, upload]);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
    } catch (e) {
      console.error(e);
    }
  }, [resultUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Upload a file
        </h1>
        <p className="text-gray-600 mb-6">
          Drop in your ZIP (or any file) to get a shareable URL.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("file")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                tab === "file"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Upload file
            </button>
            <button
              onClick={() => setTab("url")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                tab === "url"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Paste link
            </button>
          </div>

          {tab === "file" ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Choose a file
              </label>
              <input
                type="file"
                onChange={onFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
              />
              {file ? (
                <p className="text-xs text-gray-500">
                  Selected: {file.name} ({Math.ceil(file.size / 1024)} KB)
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Direct file link
              </label>
              <input
                type="url"
                placeholder="https://example.com/file.zip"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
              <p className="text-xs text-gray-500">
                We’ll fetch the file from this URL and host a copy for you.
              </p>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Uploading…" : "Upload"}
            </button>
            {error ? (
              <span className="text-sm text-red-600">{error}</span>
            ) : null}
          </div>

          {success && resultUrl ? (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-700 mb-2">Uploaded!</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  readOnly
                  value={resultUrl}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-800"
                />
                <button
                  onClick={copyUrl}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Copy URL
                </button>
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
                >
                  Open
                </a>
              </div>
              {mimeType ? (
                <p className="mt-2 text-[11px] text-gray-500">
                  Type: {mimeType}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-gray-500">
                Note: This gives you a URL you can share or use right away.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 text-xs text-gray-500 space-y-1">
          <p>
            Tip: Front‑end uploads here can handle large files. If you ever get
            a 413 error from a custom API, use this page instead.
          </p>
        </div>
      </main>
    </div>
  );
}
