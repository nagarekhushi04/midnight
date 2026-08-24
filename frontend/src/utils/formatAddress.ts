export function formatMidnightAddress(address: string | null | undefined): string {
  if (!address) return '';
  
  let cleanAddr = address.trim();
  
  if (cleanAddr.startsWith('0x') || cleanAddr.startsWith('0X')) {
    cleanAddr = cleanAddr.substring(2);
  }
  
  if (cleanAddr.length > 64) {
    cleanAddr = cleanAddr.slice(-64);
  } else if (cleanAddr.length < 64) {
    cleanAddr = cleanAddr.padStart(64, '0');
  }

  return cleanAddr;
}
