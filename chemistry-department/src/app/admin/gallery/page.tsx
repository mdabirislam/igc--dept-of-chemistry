import GalleryManager from "@/components/admin/gallery/GalleryManager";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          গ্যালারি ব্যবস্থাপনা
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          ছবি, ভিডিও (লিংক) এবং দেয়ালিকা যোগ ও পরিচালনা করুন।
        </p>
      </div>

      <GalleryManager />
    </div>
  );
}
