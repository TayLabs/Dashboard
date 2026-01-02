export type FormActionResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			error?: string;
			errors?: Record<string, string>;
	  };
