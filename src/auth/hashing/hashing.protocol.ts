export abstract class HashingServiceProtocol {
  abstract hash(data: string): Promise<string>;
  abstract compare(data: string, hashedData: string): Promise<boolean>;
}
