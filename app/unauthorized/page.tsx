import Link from "next/link";

export const metadata = {
  title: "Unauthorized | Your Restaurant",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-8">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}