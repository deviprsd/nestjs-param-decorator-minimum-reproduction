import {
  BadRequestException,
  Controller,
  createParamDecorator,
  ExecutionContext,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Schema, z } from 'zod';

const user = z.object({
  hello: z.string(),
});

const SchemaBody = createParamDecorator(
  (schema: Schema<any>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dataValidation = schema.safeParse(request.body);
    if (!dataValidation.success) {
      throw new BadRequestException('invalid request body data');
    }

    return request.body;
  },
);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@SchemaBody(user) firstName: z.infer<typeof user>): string {
    return `Hello ${firstName.hello}`;
  }
}
