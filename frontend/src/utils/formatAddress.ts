export function formatMidnightAddress(address: string | null | undefined): string {
  if (!address) return '';
  
  let cleanAddr = address.trim();
  
  if (cleanAddr.startsWith('0x') || cleanAddr.startsWith('0X')) {
    cleanAddr = cleanAddr.substring(2);
  }
  
  if (cleanAddr.length !== 64) {
    console.warn(`Invalid Midnight address length: expected 64, got ${cleanAddr.length}`);
  }
  
  return cleanAddr;
}
