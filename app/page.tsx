import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          QR Code Pets
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          Sistema completo de identificação de pets através de QR Code
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Registrar
          </Link>
        </div>
      </div>
    </div>
  );
}

