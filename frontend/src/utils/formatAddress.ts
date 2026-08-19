export const formatMidnightAddress = (addr: string | null | undefined): string => {
  if (!addr) return '';
  let clean = addr.trim();
  
  // 1. Strip '0x' or '0X' prefix
  if (clean.startsWith('0x') || clean.startsWith('0X')) {
    clean = clean.slice(2);
  }

  // 2. If 34 characters, slice 2 characters
  if (clean.length === 34) {
    clean = clean.slice(2);
  }

  // 3. If 68 hex characters (34 bytes), strip leading 4-char (2-byte) prefix (e.g. '0200') to get 32-byte (64 hex char) address
  if (clean.length === 68) {
    clean = clean.slice(4);
  }

  // 4. If raw 32-char string, convert to 64 hex characters
  if (clean.length === 32 && !/^[0-9a-fA-F]{32}$/.test(clean)) {
    clean = Array.from(clean).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  }

  return clean;
};
