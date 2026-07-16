import Link from "next/link";

export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-white mb-3">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-8">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-orange-600 text-white px-6 py-2.5 font-medium hover:bg-orange-500 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}