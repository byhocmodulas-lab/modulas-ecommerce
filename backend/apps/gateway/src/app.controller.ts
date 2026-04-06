import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller({ path: "", version: VERSION_NEUTRAL })
export class AppController {
  @Get()
  root() {
    return {
      name: "Modulas API",
      version: "1.0",
      status: "ok",
      docs: "/api/docs",
      health: "/api/health",
    };
  }
}
