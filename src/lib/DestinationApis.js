import getAPIMap from "./apiUrl";
import api from "./axios";


export const getDestinations = async (searchTerm = null) => {
  let url = getAPIMap("getDestinations");
  
  const res = api.post(url, {
    paginationFilterRequest: {
      paginationAction: "INITIAL_PAGE",
      maxLimit: 10,
      sortingOrder: "ASC",
    },
    search: searchTerm !== "" && searchTerm !== null ? searchTerm : null,
    fetchStaticDestination:
      searchTerm !== "" && searchTerm !== null ? false : true,
  });
  return res;
};
