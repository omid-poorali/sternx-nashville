import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
  TasksServiceClient as NashvillService,
  UpdateTaskResponse,
} from 'src/proto/interfaces';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(@Inject('TasksService') private readonly client: ClientGrpc) {}
  private nashvillService: NashvillService;

  onModuleInit() {
    this.nashvillService =
      this.client.getService<NashvillService>('TasksService');
  }

  /**
   * create a new task.
   * @param body - the data for creating the task.
   * @returns  created task.
   */
  createTask(body: CreateTaskDto): Observable<CreateTaskResponse> {
    return this.nashvillService.createTask({
      parentId: body.parentId,
      title: body.title,
      description: body.description,
    });
  }

  /**
   * updates a task.
   * @param id - the id of the task to update.
   * @param body - the data for updating the task.
   * @returns updated the task.
   */
  updateTask(id: string, body: UpdateTaskDto): Observable<UpdateTaskResponse> {
    return this.nashvillService.updateTask({
      parentId: body.parentId,
      id: id,
      title: body.title,
      description: body.description,
    });
  }

  /**
   * deletes a task.
   * @param id - the id of the task to delete.
   * @returns deleted task.
   */
  deleteTask(id: string): Observable<DeleteTaskResponse> {
    return this.nashvillService.deleteTask({
      id,
    });
  }

  /**
   * retrieves all tasks.
   * @param page - the page number of tasks to retrieve.
   * @returns all tasks.
   */
  getAllTasks(page: string): Observable<GetAllTasksResponse> {
    return this.nashvillService.getAllTasks({
      page: parseInt(page, 10) || 1,
    });
  }
}
