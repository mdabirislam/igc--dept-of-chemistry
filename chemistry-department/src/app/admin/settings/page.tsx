import SiteSettingsForm from "@/components/admin/settings/SiteSettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          সাইট সেটিংস
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          বিভাগীয় প্রধানের তথ্য এবং যোগাযোগের তথ্য এখান থেকে
          পরিবর্তন করুন। পরিবর্তন সাথে সাথে ওয়েবসাইটে দেখা যাবে।
        </p>
      </div>

      <SiteSettingsForm />
    </div>
  );
}
