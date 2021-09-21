const DEFAULT_LIMIT = 15;

export function isValidRange(range: any) {
  return (
    typeof (range === "string" || typeof range === "number") && !isNaN(+range)
  );
}

export function paginate({
  limit,
  skip,
}: {
  limit?: string | number;
  skip?: string | number;
}) {
  return {
    limit: limit && isValidRange(limit) ? +limit : DEFAULT_LIMIT,
    skip: skip && isValidRange(skip) ? +skip : 0,
  };
}

export function isValidOrdering(orderType?: string | number): boolean {
  const t = orderType?.toString().toLowerCase();

  return (
    !!t &&
    (typeof t === "string" || typeof t === "number") &&
    (t === "1" || t === "-1" || t === "asc" || t === "desc")
  );
}
