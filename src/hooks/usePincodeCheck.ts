// src/hooks/usePincodeCheck.ts
import { useState } from "react";
import { getCityFromPincode, isCitySupported, getDeliveryDate } from "../utils/pincodeService";

export function usePincodeCheck() {
  const [city, setCity] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const checkPincode = async (pincode: string) => {
    setLoading(true);

    const detectedCity = await getCityFromPincode(pincode);
    const supported = isCitySupported(detectedCity);

    setCity(detectedCity);
    setIsSupported(supported);
    setDeliveryDate(supported ? getDeliveryDate() : "");

    setLoading(false);
  };

  return { city, isSupported, deliveryDate, loading, checkPincode };
}
