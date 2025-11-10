import QRCode from 'qrcode';
import { randomUUID } from 'crypto';

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export function generateQRCodeId(): string {
  return randomUUID();
}

export function getPublicUrl(qrCodeId: string): string {
  return `${BASE_URL}/pet/${qrCodeId}`;
}

export async function generateQRCodeImage(qrCodeId: string): Promise<string> {
  const url = getPublicUrl(qrCodeId);
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code image');
  }
}

export async function generateQRCodeSVG(qrCodeId: string): Promise<string> {
  const url = getPublicUrl(qrCodeId);
  
  try {
    const qrCodeSVG = await QRCode.toString(url, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return qrCodeSVG;
  } catch (error) {
    throw new Error('Failed to generate QR code SVG');
  }
}
