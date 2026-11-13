import { Global, Module } from '@nestjs/common';
import { JsonFileReader } from './json-file.reader';

@Global()
@Module({
  providers: [JsonFileReader],
  exports: [JsonFileReader],
})
export class JsonDataModule {}
