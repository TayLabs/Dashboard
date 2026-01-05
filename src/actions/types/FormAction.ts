// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormActionResponse<T = Record<string, any>> =
  | ({
      success: true;
    } & T)
  | {
      success: false;
      error?: string;
      errors?: Record<string, string>;
    };
