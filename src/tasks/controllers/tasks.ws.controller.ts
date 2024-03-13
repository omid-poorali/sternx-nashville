import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TasksService } from '../tasks.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/namespace',
})
export class TasksWsController {
  constructor(private readonly tasksService: TasksService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createTask')
  createTask(client: Socket, body: CreateTaskDto) {
    this.tasksService.createTask(body).subscribe((result) => {
      client.emit('result', JSON.stringify(result));
    });
  }

  @SubscribeMessage('getTasks')
  async getTasks(client: Socket, body: { page: string }) {
    this.tasksService.getAllTasks(body.page).subscribe((result) => {
      client.emit('result', JSON.stringify(result));
    });
  }

  @SubscribeMessage('updateTask')
  async updateTask(client: Socket, body: { id: string } & UpdateTaskDto) {
    this.tasksService.updateTask(body.id, body).subscribe((result) => {
      client.emit('result', JSON.stringify(result));
    });
  }

  @SubscribeMessage('deleteTask')
  async deleteTask(client: Socket, taskId: string) {
    this.tasksService.deleteTask(taskId).subscribe((result) => {
      client.emit('result', JSON.stringify(result));
    });
  }
}
