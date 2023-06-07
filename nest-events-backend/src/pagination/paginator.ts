import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export interface PaginationResults<T> {
  first: number;
  last: number;
  limit: number;
  data: T[];
  total?: number;
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginationOptions
): Promise<PaginationResults<T>> {
  console.log(typeof options.currentPage);
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.offset(offset).limit(options.limit).getMany();

  return {
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : null,
    data
  };
}
