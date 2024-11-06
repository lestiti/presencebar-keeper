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
  const prefix = "200"; // Fixed prefix for our system
  const paddedId = id.toString().padStart(9, "0");
  const code = prefix + paddedId;
  
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return code + checkDigit;
};