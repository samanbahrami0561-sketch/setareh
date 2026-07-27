export function numberToPersianWords(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'صفر تومان';

  const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هیجده', 'نوزده'];
  const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const scale = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

  function convertThreeDigits(n: number): string {
    let parts: string[] = [];
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    const t = Math.floor(remainder / 10);
    const u = remainder % 10;

    if (h > 0) parts.push(hundreds[h]);

    if (remainder >= 10 && remainder < 20) {
      parts.push(teens[remainder - 10]);
    } else {
      if (t > 0) parts.push(tens[t]);
      if (u > 0) parts.push(units[u]);
    }

    return parts.join(' و ');
  }

  let currentNum = Math.abs(num);
  let groups: number[] = [];

  while (currentNum > 0) {
    groups.push(currentNum % 1000);
    currentNum = Math.floor(currentNum / 1000);
  }

  let resultParts: string[] = [];

  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i];
    if (groupVal > 0) {
      const groupText = convertThreeDigits(groupVal);
      const scaleText = scale[i];
      resultParts.push(scaleText ? `${groupText} ${scaleText}` : groupText);
    }
  }

  return resultParts.join(' و ') + ' تومان';
}
