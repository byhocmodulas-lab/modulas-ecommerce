// Minimal process/env declaration for frontend TypeScript checks
declare var process: {
  env: {
    NODE_ENV?: 'development' | 'production' | 'test' | string;
    [key: string]: string | undefined;
  };
};
