// src/utils/pincodeService.ts

export const supportedCities =[
  // Delhi, Noida, Gurgaon, Ghaziabad, Faridabad
  "Central Delhi", "East Delhi", "New Delhi", "North Delhi"," North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi",
  "Gautam Buddh Nagar",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",

  // Mumbai, Pune
  "Mumbai City", "Mumbai Suburban",
  "Pune",

  // Kolkata, Bangalore, Chennai
  "Kolkata",
  "Bangalore Urban",
  "Chennai",

  // Hyderabad, Visakhapatnam, Goa
  "Hyderabad",
  "Visakhapatnam",
  "North Goa","South Goa",

  // Surat, Nagpur, Aurangabad
  "Surat",
  "Nagpur",
  "Aurangabad",

  // Bhopal, Coimbatore, Ludhiana
  "Bhopal",
  "Coimbatore",
  "Ludhiana",

  // Kochi, Vadodara, Patna
  "Ernakulam",
  "Vadodara",
  "Patna",

  // Bhubaneswar, Thiruvananthapuram, Rajkot
  "Khordha",
  "Thiruvananthapuram",
  "Rajkot",

  // Nashik, Vijayawada, Guwahati
  "Nashik",
  "NTR",
  "Kamrup Metropolitan",

  // Jodhpur, Mangalore, Amritsar
  "Jodhpur",
  "Dakshina Kannada",
  "Amritsar",

  // Raipur, Ranchi, Gwalior
  "Raipur",
  "Ranchi",
  "Gwalior",

  // Agra, Udaipur, Dehradun
  "Agra",
  "Udaipur",
  "Dehradun",

  // South West Delhi
  "South West Delhi"
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
