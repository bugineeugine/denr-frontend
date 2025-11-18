export type Results<DT> = {
  results: DT;
  page: number;
  page_size: number;
  total: number;
};

export type DataResponseType<Result extends "results" | "data", T = null> = {
  message: string;
  statusCode: number;
  data: Result extends "results" ? Results<T> : T;
  error: string;
};
