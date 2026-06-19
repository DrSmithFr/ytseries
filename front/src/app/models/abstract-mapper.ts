// abstract-mapper.ts
import { inject } from '@angular/core';
import { DateService } from '../services/api/utils/date.service';

/**
 * Custom error raised when a required field is missing or empty.
 */
export class FieldEmptyError extends Error {
  constructor() {
    super(`value undefined`);
    this.name = 'FieldEmptyError';
  }
}

/**
 * Base class for all DTO ↔︎ Model mappers.
 *
 * @template Tdto  DTO type
 * @template Tmodel  Model type
 */
export abstract class AbstractMapper<Tdto, Tmodel> {
  /**
   * @private
   * Service used to create Date objects from strings.
   */
  protected readonly dateService = inject(DateService);

  /**
   * Convert a single DTO into a Model.
   */
  public abstract fromDto(dto: Tdto): Tmodel;

  /**
   * Convert a single Model into a DTO.
   */
  public abstract toDto(model: Tmodel): Tdto;

  /* ---------- collection helpers ---------- */

  public fromDtos(dtos: Tdto[]): Tmodel[] {
    return dtos.map(d => this.fromDto(d));
  }

  public toDtos(models: Tmodel[]): Tdto[] {
    return models.map(m => this.toDto(m));
  }

  /* ---------- simple mapping helpers ---------- */

  /** Shortcut helpers for readability. */
  protected mapString(value: string | null | undefined, default_value?: string): string {
    return this.mapAny<string>(value, default_value);
  }

  protected mapNumber(value: number | null | undefined, default_value?: number): number {
    return this.mapAny<number>(value, default_value);
  }

  protected mapBoolean(value: boolean | null | undefined, default_value?: boolean): boolean {
    return this.mapAny<boolean>(value, default_value);
  }

  /* ---------- collection mapping helpers ---------- */

  /**
   * Map an array of DTOs into an array of Models using a mapper.
   */
  protected mapArray<T>(
    values: any,
    fn: (value: any, default_value: any | undefined) => T,
    default_value: T[] | undefined = undefined
  ): T[] {
    if (this.valueExist<T[]>(values)) {
      return values.map((v: any) => {
        return fn.bind(this)(v, undefined)
      });
    }

    return this.defaultOrError(default_value)
  }

  /* ---------- nested mapping helpers ---------- */

  /**
   * Map a nested DTO into a Model using a mapper.
   */
  protected mapModel<Tdto, Tmodel>(
    value: any,
    mapper: AbstractMapper<Tdto, Tmodel>,
    default_value: Tmodel
  ): Tmodel {
    if (this.valueExist<Tdto>(value)) {
      return mapper.fromDto(value as Tdto);
    }

    return this.defaultOrError(default_value)
  }

  protected mapModels<Tdto, Tmodel>(
    values: any[] | undefined | null,
    mapper: AbstractMapper<Tdto, Tmodel>,
    default_value: Tmodel[] | undefined = undefined
  ): Tmodel[] {
    if (this.valueExist<Tdto[]>(values)) {
      return mapper.fromDtos(values as Tdto[]);
    }

    return this.defaultOrError(default_value)
  }

  /* ---------- date helper ---------- */

  protected mapDate(
    value: string | null | undefined,
    default_value: Date | undefined = undefined): Date {
    if (this.valueExist<string>(value)) {
      return this.dateService.makeDateFromString(value as string);
    }

    return this.defaultOrError(default_value)
  }

  protected mapTimestamp(
    value: number | null | undefined,
    default_value: Date | undefined = undefined
  ): Date {
    if (this.valueExist<number>(value)) {
      return new Date(value as number * 1000);
    }

    return this.defaultOrError(default_value)
  }

  /* ---------- utility ---------- */

  /**
   * Generic value mapper that also applies an optional default.
   */
  protected mapAny<T>(
    value: T | undefined | null,
    default_value: T | undefined = undefined
  ): T {
    if (this.valueExist<T>(value)) {
      return value as T;
    }

    return this.defaultOrError(default_value)
  }

  /**
   * Throw a MappingError if a required value is missing.
   */
  private valueExist<T>(value: T | undefined | null): boolean {
    return !(value === undefined || value === null);
  }

  private defaultOrError<T>(default_value: T | undefined): T {
    if (default_value !== undefined) {
      return default_value
    }

    throw new FieldEmptyError();
  }
}
