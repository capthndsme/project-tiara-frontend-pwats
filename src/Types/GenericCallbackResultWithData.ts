export type GenericCallbackResultWithData<T> = {
   success: boolean;
   data: T;
   message?: string; // Optional message to display to the user.
}