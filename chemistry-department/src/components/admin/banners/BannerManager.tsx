"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import {
  apiDelete,
  apiFetch,
  apiPatch,
  apiPost,
} from "@/lib/api";
import type { HeroBanner } from "@/types/api";

import Field, { inputClass } from "@/components/admin/ui/Field";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import AdminLoading from "@/components/admin/ui/AdminLoading";
import AdminError from "@/components/admin/ui/AdminError";
import AdminEmpty from "@/components/admin/ui/AdminEmpty";

export default function BannerManager() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [order, setOrder] = useState("0");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        setBanners(await apiFetch<HeroBanner[]>("/banners/"));
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "ব্যানার লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [reloadKey]);

  function closeForm() {
    setOpen(false);
    setImage(null);
    setAltText("");
    setOrder("0");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image) {
      setError("একটি ব্যানার ছবি নির্বাচন করুন।");
      return;
    }

    const orderNumber = Number(order);

    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      setError("ক্রম (order) একটি ০ বা তার বেশি পূর্ণ সংখ্যা হতে হবে।");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("alt_text", altText.trim());
      formData.append("order", String(orderNumber));
      formData.append("is_active", "true");

      const created = await apiPost<HeroBanner>(
        "/banners/",
        formData
      );

      setBanners((current) =>
        [...current, created].sort(
          (a, b) => a.order - b.order || a.id - b.id
        )
      );

      closeForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ব্যানার সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  async function patchBanner(
    banner: HeroBanner,
    changes: Partial<Pick<HeroBanner, "is_active" | "order">>
  ) {
    setBusyId(banner.id);

    try {
      const updated = await apiPatch<HeroBanner>(
        `/banners/${banner.id}/`,
        JSON.stringify(changes)
      );

      setBanners((current) =>
        current
          .map((item) =>
            item.id === updated.id ? updated : item
          )
          .sort((a, b) => a.order - b.order || a.id - b.id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "ব্যানার আপডেট করা যায়নি।"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function removeBanner(banner: HeroBanner) {
    if (!window.confirm("এই ব্যানারটি মুছে ফেলতে চান?")) return;

    setBusyId(banner.id);

    try {
      await apiDelete(`/banners/${banner.id}/`);

      setBanners((current) =>
        current.filter((item) => item.id !== banner.id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "ব্যানার মুছে ফেলা যায়নি।"
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {!open ? (
        <div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#145218]"
          >
            <Plus size={17} />
            নতুন ব্যানার যোগ করুন
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-5 rounded-xl border bg-white p-5 shadow-sm"
        >
          <h2 className="border-b pb-4 font-semibold text-gray-800">
            নতুন ব্যানার
          </h2>

          <Field
            label="ব্যানার ছবি"
            hint="চওড়া (landscape) ছবি সবচেয়ে ভালো দেখায়। সর্বোচ্চ 5 MB।"
          >
            <ImagePicker
              file={image}
              onChange={setImage}
              onError={setError}
              className="h-56"
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="ছবির বর্ণনা (ঐচ্ছিক)">
              <input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="যেমন: ২০২১-২২ সেশনের শিক্ষার্থীবৃন্দ"
                className={inputClass}
              />
            </Field>

            <Field
              label="ক্রম (order)"
              hint="ছোট সংখ্যা আগে দেখাবে।"
            >
              <input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg border px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#1b5e20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145218] disabled:opacity-60"
            >
              {saving ? "আপলোড হচ্ছে..." : "ব্যানার যোগ করুন"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading text="ব্যানার লোড হচ্ছে..." />
      ) : loadError ? (
        <AdminError
          message={loadError}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : banners.length === 0 ? (
        <AdminEmpty
          title="কোনো ব্যানার নেই"
          description="ব্যানার যোগ না করা পর্যন্ত হোম পেজে ডিফল্ট ছবি দেখানো হবে।"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <article
              key={banner.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                {banner.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.image_url}
                    alt={banner.alt_text || "Banner"}
                    className={`h-full w-full object-cover ${
                      banner.is_active ? "" : "opacity-40"
                    }`}
                  />
                )}

                {!banner.is_active && (
                  <span className="absolute left-2 top-2 rounded-md bg-gray-800/80 px-2 py-1 text-[11px] text-white">
                    লুকানো
                  </span>
                )}
              </div>

              <div className="space-y-3 p-4">
                <p className="truncate text-sm text-gray-600">
                  {banner.alt_text || "বর্ণনা নেই"}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    ক্রম
                    <input
                      type="number"
                      min={0}
                      defaultValue={banner.order}
                      disabled={busyId === banner.id}
                      onBlur={(e) => {
                        const next = Number(e.target.value);

                        if (
                          Number.isInteger(next) &&
                          next >= 0 &&
                          next !== banner.order
                        ) {
                          void patchBanner(banner, { order: next });
                        }
                      }}
                      className="w-16 rounded-lg border px-2 py-1 text-sm"
                    />
                  </label>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      title={
                        banner.is_active ? "লুকান" : "দেখান"
                      }
                      disabled={busyId === banner.id}
                      onClick={() =>
                        void patchBanner(banner, {
                          is_active: !banner.is_active,
                        })
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20] disabled:opacity-50"
                    >
                      {banner.is_active ? (
                        <Eye size={17} />
                      ) : (
                        <EyeOff size={17} />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      disabled={busyId === banner.id}
                      onClick={() => void removeBanner(banner)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
