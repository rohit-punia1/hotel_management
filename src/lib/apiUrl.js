var APIMapping = {
  getDestinations: "/api/unsecure/dummy/hotels/places",
  searchHotels: "/api/unsecure/dummy/hotels",
 
};

function getAPIMap(name) {
  return APIMapping[name];
}

export default getAPIMap;
