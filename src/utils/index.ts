export const getCityFromLocation = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();

    return data.city;
  } catch (error) {
    console.log("Error getting city from location:", error);
    return undefined;
  }
};
