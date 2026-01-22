const NUMBER_SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];

function getSuffixInfo(num: number): { suffix: string; value: number; precision: number } {
  if (num < 1000) {
    return { suffix: '', value: num, precision: 0 };
  }

  const suffixNum = Math.floor(Math.log10(num) / 3);

  if (suffixNum >= NUMBER_SUFFIXES.length) {
    return { suffix: '', value: num, precision: 0 };
  }

  const value = num / Math.pow(1000, suffixNum);
  const precision = value >= 100 ? 0 : 1;

  return { suffix: NUMBER_SUFFIXES[suffixNum], value, precision };
}

export function formatNumber(num: number): string {
  if (num < 1) return num.toFixed(2);
  if (num < 10) return num.toFixed(1);
  if (num < 100) return num.toFixed(0);
  if (num < 1000) return Math.floor(num).toString();

  const { suffix, value, precision } = getSuffixInfo(num);
  if (!suffix) return num.toExponential(2);

  return value.toFixed(precision) + suffix;
}

export function formatNumberDetailed(num: number): string {
  if (num < 1) return num.toFixed(3);
  if (num < 10) return num.toFixed(2);
  if (num < 100) return num.toFixed(1);
  if (num < 1000) return num.toFixed(0);

  const { suffix, value, precision } = getSuffixInfo(num);
  if (!suffix) return num.toExponential(2);

  return value.toFixed(precision) + suffix;
}

export function formatNumberFull(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  return formatNumber(num);
}
