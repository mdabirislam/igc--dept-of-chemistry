export default function AdminPage() {
  return (
    <div className="p-5 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ড্যাশবোর্ড
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Chemistry Department Content Management
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="নোটিশ"
          value="12"
        />

        <DashboardCard
          title="শিক্ষকবৃন্দ"
          value="18"
        />

        <DashboardCard
          title="রিসোর্স"
          value="35"
        />

        <DashboardCard
          title="ইভেন্ট"
          value="6"
        />
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Chemistry Department
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          বিভাগীয় নোটিশ, শিক্ষকবৃন্দ, একাডেমিক রিসোর্স এবং
          ইভেন্ট পরিচালনার জন্য Admin Dashboard।
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-[#1b5e20]">
        {value}
      </p>
    </div>
  );
}