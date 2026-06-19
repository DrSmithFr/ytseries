import { Injectable } from '@angular/core';
import { ApiVersionModel } from '../../../models/api/api-version.model';
import { environment } from '../../../../environments/environment';

export enum IncompatibilityLevel {
  patch = 1,
  minor = 2,
  major = 3,
}

export enum IncompatibilityType {
  client = 'client_app_outdated',
  server = 'server_api_outdated',
}

export class Incompatibility {
  level: IncompatibilityLevel;
  type: IncompatibilityType;

  constructor(level: IncompatibilityLevel, type: IncompatibilityType) {
    this.level = level;
    this.type  = type;
  }
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class VersionService {
  private readonly expected: ApiVersionModel;

  constructor() {
    this.expected = this.parseVersion(environment.api.version);
  }

  parseVersion(version: string): ApiVersionModel {
    const [major, minor, patch] = version.split('.').map(v => parseInt(v, 10));
    return new ApiVersionModel(version, major, minor, patch);
  }

  getExpectedVersion(): ApiVersionModel {
    return this.expected
  }

  isCompatible(version: ApiVersionModel): true | Incompatibility {
    const expected = this.getExpectedVersion();
    if (expected.major !== version.major) {
      return new Incompatibility(
        IncompatibilityLevel.major,
        expected.major > version.major ? IncompatibilityType.server : IncompatibilityType.client,
      );
    }

    if (expected.minor !== version.minor) {
      return new Incompatibility(
        IncompatibilityLevel.minor,
        expected.minor > version.minor ? IncompatibilityType.server : IncompatibilityType.client,
      );
    }

    if (expected.patch !== version.patch) {
      return new Incompatibility(
        IncompatibilityLevel.patch,
        expected.patch > version.patch ? IncompatibilityType.server : IncompatibilityType.client,
      );
    }

    return true;
  }
}
