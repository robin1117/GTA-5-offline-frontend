const amountValue = import.meta.env.VITE_AMOUNT || "300";
const upiIdValue = import.meta.env.VITE_UPI_ID || "7015526876@ybl";

export const AMOUNT = amountValue;
export const FORMATTED_AMOUNT = `₹${amountValue}`;
export const UPI_ID = upiIdValue;
