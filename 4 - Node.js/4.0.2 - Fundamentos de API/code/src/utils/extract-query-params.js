export function extractQueryParams(query) {
  const result = query
    .slice(1)
    .split("&")
    .reduce((queryParams, param) => {
      const [key, value] = param.split("=");
      queryParams[key] = value;
      return queryParams;
    }, {});

  console.log("Query Params extraídos:", result);
  return result;
}
