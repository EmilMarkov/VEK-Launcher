export type ActionStatus = 'REQUEST' | 'SUCCESS' | 'FAILURE';
export type AppActionBase<T, S extends ActionStatus> = { type: T, status: S };