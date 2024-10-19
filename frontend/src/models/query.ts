export interface QueryOptions {
  page: number;
  page_size: number;
  order_by: string;
  search: string;
  filters: { [key: string]: any }
}