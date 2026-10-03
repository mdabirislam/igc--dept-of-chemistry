"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { apiFetch, apiPatch } from "@/lib/api";
import type { SiteSettings } from "@/types/api";

import Field, { inputClass } from "@/components/admin/ui/Field";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import AdminLoading from "@/components/admin/ui/AdminLoading";
import AdminError from "@/components/admin/ui/AdminError";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isHttpUrl(value: string) {
  return /^https?:\/\/\S+$/i.test(value);
}

interface FormValues {
  head_name: string;
  head_designation: string;
  head_quote: string;
  head_message: string;
  address: string;
  phone: string;
  email: string;
  facebook_page_url: string;
  facebook_group_url: string;
}

const emptyValues: FormValues = {
  head_name: "",
  head_designation: "",
  head_quote: "",
  head_message: "",
  address: "",
  phone: "",
  email: "",
  facebook_page_url: "",
  facebook_group_url: "",
};

function toValues(data: SiteSettings): FormValues {
  return {
    head_name: data.head_name,
    head_designation: data.head_designation,
    head_quote: data.head_quote,
    head_message: data.head_message,
    address: data.address,
    phone: data.phone,
    email: data.email,
    facebook_page_url: data.facebook_page_url,
    facebook_group_url: data.facebook_group_url,
  };
}

export default function SiteSettingsForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [headImageUrl, setHeadImageUrl] = useState<string | null>(null);
  const [headImage, setHeadImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await apiFetch<SiteSettings>("/site-settings/");

        setValues(toValues(data));
        setHeadImageUrl(data.head_image_url);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "সেটিংস লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [reloadKey]);

  function update(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    const email = values.email.trim();
    const page = values.facebook_page_url.trim();
    const group = values.facebook_group_url.trim();

    if (email && !EMAIL_PATTERN.test(email)) {
      setError("সঠিক email address লিখুন।");
      return;
    }

    if (page && !isHttpUrl(page)) {
      setError("Facebook page link অবশ্যই http:// বা https:// দিয়ে শুরু হতে হবে।");
      return;
    }

    if (group && !isHttpUrl(group)) {
      setError("Facebook group link অবশ্যই http:// বা https:// দিয়ে শুরু হতে হবে।");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      (Object.keys(values) as (keyof FormValues)[]).forEach(
        (key) => {
          formData.append(key, values[key].trim());
        }
      );

      if (headImage) {
        formData.append("head_image", headImage);
      }

      const data = await apiPatch<SiteSettings>(
        "/site-settings/",
        formData
      );

      setValues(toValues(data));
      setHeadImageUrl(data.head_image_url);
      setHeadImage(null);
      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "সেটিংস সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <AdminLoading text="সেটিংস লোড হচ্ছে..." />;
  }

  if (loadError) {
    return (
      <AdminError
        message={loadError}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Department head */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 border-b pb-4">
          <h2 className="font-semibold text-gray-800">
            বিভাগীয় প্রধানের তথ্য
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            হোম পেজের &quot;Message from the Head&quot; অংশে দেখানো হবে।
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <Field label="ছবি" hint="সর্বোচ্চ 5 MB">
            <ImagePicker
              file={headImage}
              existingUrl={headImageUrl}
              onChange={(file) => {
                setHeadImage(file);
                setSaved(false);
              }}
              onError={setError}
              className="h-72"
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="নাম">
              <input
                value={values.head_name}
                onChange={(e) => update("head_name", e.target.value)}
                placeholder="ড. অহিদুর রহমান"
                className={inputClass}
              />
            </Field>

            <Field label="পদবি">
              <input
                value={values.head_designation}
                onChange={(e) =>
                  update("head_designation", e.target.value)
                }
                placeholder="বিভাগীয় প্রধান"
                className={inputClass}
              />
            </Field>

            <Field
              label="উক্তি (Quote)"
              hint="বার্তার উপরে বড় করে দেখানো ছোট বাক্য।"
              className="md:col-span-2"
            >
              <textarea
                rows={3}
                value={values.head_quote}
                onChange={(e) => update("head_quote", e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="বার্তা" className="md:col-span-2">
              <textarea
                rows={6}
                value={values.head_message}
                onChange={(e) =>
                  update("head_message", e.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 border-b pb-4">
          <h2 className="font-semibold text-gray-800">
            যোগাযোগের তথ্য
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Footer এবং যোগাযোগ পেজে দেখানো হবে।
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="ঠিকানা" className="md:col-span-2">
            <input
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="ঈশ্বরদী সরকারি কলেজ, মশুরিয়া পাড়া, ঈশ্বরদী-৬৬২০, পাবনা"
              className={inputClass}
            />
          </Field>

          <Field label="মোবাইল নম্বর">
            <input
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="chemistry@example.com"
              className={inputClass}
            />
          </Field>

          <Field label="Facebook Page link">
            <input
              value={values.facebook_page_url}
              onChange={(e) =>
                update("facebook_page_url", e.target.value)
              }
              placeholder="https://www.facebook.com/..."
              className={inputClass}
            />
          </Field>

          <Field label="Facebook Group link">
            <input
              value={values.facebook_group_url}
              onChange={(e) =>
                update("facebook_group_url", e.target.value)
              }
              placeholder="https://www.facebook.com/groups/..."
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2.5 text-sm text-green-700">
          <CheckCircle2 size={17} />
          সেটিংস সংরক্ষণ করা হয়েছে।
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#1b5e20] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#145218] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
        </button>
      </div>
    </form>
  );
}
