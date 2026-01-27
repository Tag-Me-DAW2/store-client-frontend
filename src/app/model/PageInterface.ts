export interface PageInterface<T> {
    data: T[],
    pageNumber: number,
    pageSize: number,
    totalElements: number,
    totalPages: number
}