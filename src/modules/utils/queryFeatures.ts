const DEFAULT_LIMIT = 15;

export function isValidRange(range: any) {
  return (
    typeof (range === "string" || typeof range === "number") && !isNaN(+range)
  );
}

export function paginate({
  take,
  skip,
}: {
  take?: string | number;
  skip?: string | number;
}) {
  return {
    take: take && isValidRange(take) ? +take : DEFAULT_LIMIT,
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
