export class CreateTaskDto {
  parentId?: string | undefined;
  title: string;
  description?: string | undefined;
}
