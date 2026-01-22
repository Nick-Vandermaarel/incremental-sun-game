export function formatNumber(num: number): string {
  if (num < 1) return num.toFixed(2);
  if (num < 10) return num.toFixed(1);
  if (num < 100) return num.toFixed(0);
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  const suffixNum = Math.floor(Math.log10(num) / 3);
  
  if (suffixNum >= suffixes.length) {
    return num.toExponential(2);
  }
  
  const shortNum = num / Math.pow(1000, suffixNum);
  return shortNum.toFixed(shortNum >= 100 ? 0 : 1) + suffixes[suffixNum];
}

export function formatNumberDetailed(num: number): string {
  if (num < 1) return num.toFixed(3);
  if (num < 10) return num.toFixed(2);
  if (num < 100) return num.toFixed(1);
  if (num < 1000) return num.toFixed(0);
  
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  const suffixNum = Math.floor(Math.log10(num) / 3);
  
  if (suffixNum >= suffixes.length) {
    return num.toExponential(2);
  }
  
  const shortNum = num / Math.pow(1000, suffixNum);
  return shortNum.toFixed(shortNum >= 100 ? 0 : 1) + suffixes[suffixNum];
}

export function formatNumberFull(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  return formatNumber(num);
}
