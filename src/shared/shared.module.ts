import { Module } from '@nestjs/common';
import { TimingConnectionInterceptor } from './interceptors';

@Module({
  providers: [],
  exports: [TimingConnectionInterceptor],
})
export class SharedModule {}
