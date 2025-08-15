export function buildHotelSearchPayload(query, filters = {}) {
  const parseAges = (agesString) => {
    try {
      const arr = JSON.parse(agesString || "[]");
      return Array.isArray(arr) ? arr.map((a) => Number(a)) : [];
    } catch {
      return [];
    }
  };

  const stay = {
    checkIn: query.fromDate || "",
    checkOut: query.toDate || "",
  };

  // Support multiple occupancies (e.g. multiple rooms)
  const occupancies = [];
  const childrenAges = parseAges(query.childrenAges);

  occupancies.push({
    rooms: Number(query.rooms) || 1,
    adults: Number(query.adults) || 1,
    children: Number(query.children) || 0,
    ...(childrenAges.length
      ? {
          paxes: childrenAges.map((age) => ({
            type: "CH",
            age,
          })),
        }
      : {}),
  });

  // Base payload
  const payload = {
    traceId: `${Date.now()}`,
    destinationId: Number(query.destinationId),
    stay,
    occupancies,
  };

  // If filters exist, add them
  if (filters && Object.keys(filters).length > 0) {
    if (filters?.extrafilter) {
      payload.extrafilter = {
        minRate: Number(filters.extrafilter.minRate) || undefined,
        maxRate: Number(filters.extrafilter.maxRate) || undefined,
        minCategory: Number(filters.extrafilter.minCategory) || undefined,
        maxCategory: Number(filters.extrafilter.maxCategory) || undefined,
      };
    }

    if (filters?.reviews) {
      payload.reviews = [
        {
          maxRate: Number(filters?.reviews?.[0]?.maxRate) || undefined,
          minRate: Number(filters?.reviews?.[0]?.minRate) || undefined,
          minReviewCount: 1,
          type: "TRIPADVISOR",
        },
      ];
    }

    if (filters.boards.board && filters.boards.board.length > 0) {
      payload.boards = {
        board: filters.boards.board || [],
        included: filters.boards.included ?? true,
      };
    }
  }

  return payload;
}
