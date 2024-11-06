import JsBarcode from 'jsbarcode';

export const generateBarcode = (value: string): string => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value, {
    format: "EAN13",
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
  });
  return canvas.toDataURL("image/png");
};

export const generateEAN13 = (id: number): string => {
  // Start with prefix 200 (3 digits)
  const prefix = "200";
  
  // Pad the ID to 9 digits
  const paddedId = id.toString().padStart(9, "0");
  
  // Combine prefix and padded ID (now 12 digits)
  const code = prefix + paddedId;
  
  // Calculate check digit
  let oddSum = 0;
  let evenSum = 0;
  
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      oddSum += parseInt(code[i]);
    } else {
      evenSum += parseInt(code[i]);
    }
  }
  
  const total = oddSum + (evenSum * 3);
  const checkDigit = (10 - (total % 10)) % 10;
  
  // Return complete 13-digit code
  return code + checkDigit;
};