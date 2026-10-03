import BannerManager from "@/components/admin/banners/BannerManager";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          হিরো ব্যানার
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          হোম পেজের উপরের স্লাইডারে যে ছবিগুলো ঘুরে ঘুরে দেখানো
          হয় সেগুলো পরিচালনা করুন।
        </p>
      </div>

      <BannerManager />
    </div>
  );
}
