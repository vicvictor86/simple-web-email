export function getParamsOfQueryParams(queryParams: string | undefined): any {
  if(!queryParams) return ({} as any);

  return queryParams.split('&').reduce((accumulator, current) => {
    const [key, value] = current.split('=');
    accumulator[key] = value;
    return accumulator;
  }, {} as any);
}