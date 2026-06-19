export class ApiVersionModel {
  constructor(
    public version: string,
    public major: number,
    public minor: number,
    public patch: number,
  ) {
  }
}
