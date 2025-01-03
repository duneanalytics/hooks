export type QueryParamValue = string | number | boolean;

export type QueryParams = Record<
  string,
  QueryParamValue | QueryParamValue[] | undefined
>;

export type HttpRequestOptions = {
  query?: QueryParams;
};

export class HttpClient {
  constructor(
    public readonly baseUrl: string,
    public readonly apiKey: string
  ) {}

  async get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request("GET", path, options);
  }

  async request<T>(
    method: string,
    path: string,
    { query }: HttpRequestOptions = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query !== undefined) {
      appendQueryParams(url.searchParams, query);
    }

    const response = await fetch(url, {
      method,
      headers: {
        "X-Dune-Api-Key": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

function appendQueryParams(
  searchParams: URLSearchParams,
  queryParams: QueryParams
) {
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      searchParams.append(key, value.join(","));
    } else {
      searchParams.append(key, value.toString());
    }
  }
}
