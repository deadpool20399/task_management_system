import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 'id1',
      title: 'This is title 1',
      description: 'This is description 1',
      status: TaskStatus.OPEN,
    },
    {
      id: 'id2',
      title: 'This is title 2',
      description: 'This is description 2',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: 'id3',
      title: 'This is title 3',
      description: 'This is description 3',
      status: TaskStatus.DONE,
    },
    {
      id: 'id4',
      title: 'This is title 4',
      description: 'This is description 4',
      status: TaskStatus.OPEN,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getFilterTasks(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  deleteTaskById(id: string) {
    const found = this.getTaskById(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    } else {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
