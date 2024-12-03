import {
	Injectable,
	CanActivate,
	HttpException,
	HttpStatus,
  } from "@nestjs/common";
import * as Zen from "@aikidosec/firewall";

  @Injectable()
  export class ZenGuard implements CanActivate {
	canActivate(): boolean {
  
	  const result = Zen.shouldBlockRequest();
  
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
}
