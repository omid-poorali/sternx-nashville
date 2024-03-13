import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksApiController } from './controllers/tasks.rest.controller';
import { TasksWsController } from './controllers/tasks.ws.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TasksService',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'tasks',
            protoPath: ['src/proto/tasks.proto'],
            url: `${configService.get<string>('GRPC_URI')}`,
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
  controllers: [TasksApiController],
  providers: [TasksService, TasksWsController],
})
export class TasksModule {}
