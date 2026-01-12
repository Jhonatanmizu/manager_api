import { Module } from '@nestjs/common';

export type DynamicModuleConfig = Record<string, any>;

export const DYNAMIC_MODULE_OPTIONS = 'DYNAMIC_MODULE_OPTIONS';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class DynamicModule {
  static register(configs: DynamicModuleConfig): DynamicModule {
    return {
      module: DynamicModule,
      controllers: [],
      providers: [
        {
          provide: DYNAMIC_MODULE_OPTIONS,
          useValue: configs,
        },
      ],
      exports: [],
    };
  }
}
