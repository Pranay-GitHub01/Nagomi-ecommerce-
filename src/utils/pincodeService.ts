// src/utils/pincodeService.ts

export const supportedCities = [
  "Delhi","Noida","Gurgaon","Ghaziabad","Faridabad","Mumbai","Pune",
  "Kolkata","Bangalore","Chennai","Hyderabad","Visakhapatnam","Goa",
  "Surat","Nagpur","Aurangabad","Bhopal","Coimbatore","Ludhiana","Kochi",
  "Vadodara","Patna","Bhubaneswar","Thiruvananthapuram","Rajkot","Nashik",
  "Vijayawada","Guwahati","Jodhpur","Mangalore","Amritsar","Raipur","Ranchi",
  "Gwalior","Agra","Udaipur","Dehradun","South West Delhi"
] as const;

export type SupportedCity = typeof supportedCities[number];

export const getDeliveryDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
};

export const getCityFromPincode = async (pincode: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    return data?.[0]?.PostOffice?.[0]?.District || null;
  } catch {
    return null;
  }
};

export const isCitySupported = (city: string | null): boolean => {
  return city !== null && supportedCities.includes(city as SupportedCity);
};
