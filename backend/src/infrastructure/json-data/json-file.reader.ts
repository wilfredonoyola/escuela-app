import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppConfig } from '../../config/configuration';

/**
 * Lee archivos JSON del directorio de datos. Es la única pieza que sabe
 * que los datos viven en archivos: al migrar a una base de datos se
 * reemplazan los repositorios JSON y nada más cambia.
 */
@Injectable()
export class JsonFileReader {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  async read<T>(fileName: string): Promise<T> {
    const path = join(this.config.get('dataDir', { infer: true }), fileName);
    return JSON.parse(await readFile(path, 'utf-8')) as T;
  }
}
