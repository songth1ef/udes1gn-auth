import 'express';

declare module 'express' {
  export interface Response {
    locals: Record<string, any>;
  }
}
