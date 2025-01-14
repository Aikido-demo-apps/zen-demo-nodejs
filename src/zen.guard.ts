import {
  Injectable,
  CanActivate,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { shouldBlockRequest, setUser } from '@aikidosec/firewall';

@Injectable()
export class ZenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<any> | Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = (request.headers['x-forwarded-for'] as string) || false;

    // 75% chance to set a user
    if (ip !== false && Math.random() < 0.75) {
      const user = this.generateUserFromIP(ip);
      setUser(user);
    }

    const result = shouldBlockRequest();

    if (result.block) {
      if (result.type === "ratelimited") {
        let message = "You are rate limited by Zen.";
        if (result.trigger === "ip" && result.ip) {
          message += ` (Your IP: ${result.ip})`;
        }

        throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
      }

      if (result.type === "blocked") {
        throw new HttpException(
          "You are blocked by Zen.",
          HttpStatus.FORBIDDEN
        );
      }
    }

    return true;
  }

  // List of random first names and last names for generating users
  private readonly firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley'
  ];

  private readonly lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker'
  ];

  // Generate a deterministic number from a string
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate a consistent random user based on IP
  private generateUserFromIP(ip: string): { id: string; name: string } {
    const hash = this.hashCode(ip);

    // Use the hash to consistently select first and last names
    const firstName = this.firstNames[hash % this.firstNames.length];
    const lastName = this.lastNames[(hash >> 4) % this.lastNames.length];

    // Generate a consistent user ID based on the IP
    const userId = hash.toString(36).substring(0, 8);

    return {
      id: userId,
      name: `${firstName} ${lastName}`,
    };
  }
}
