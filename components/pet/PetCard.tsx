import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PetCardProps {
  id: string
  name: string
  breed?: string
  species: string
  photoUrl?: string
  isLost: boolean
  qrCodeId: string
}

export const PetCard: React.FC<PetCardProps> = ({
  id,
  name,
  breed,
  species,
  photoUrl,
  isLost,
  qrCodeId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-200">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {isLost && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            PERDIDO
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{species}</p>
        {breed && <p className="text-sm text-gray-500">{breed}</p>}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/dashboard/pets/${id}`}
            className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Editar
          </Link>
          <Link
            href={`/dashboard/pets/${id}/qrcode`}
            className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            QR Code
          </Link>
        </div>
      </div>
    </div>
  )
}

