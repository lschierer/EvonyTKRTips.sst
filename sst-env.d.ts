/* tslint:disable */

import 'sst';
declare module 'sst' {
  export interface Resource {
    EvonyService: {
      type: 'sst.aws.Service';
      url: string;
    };
  }
}
export {};
