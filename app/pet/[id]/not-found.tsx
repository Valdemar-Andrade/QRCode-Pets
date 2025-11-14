import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Pet não encontrado
        </h2>
        <p className="text-gray-600 max-w-md">
          O QR Code escaneado não corresponde a nenhum pet cadastrado no sistema.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-semibold"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
