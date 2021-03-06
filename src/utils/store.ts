import {
  DONE_COLUMN_NAME,
  IN_PROGRESS_COLUMN_NAME,
  TESTING_COLUMN_NAME,
  TODO_COLUMN_NAME,
} from "../constants/exampleColumnNames";
import { ColumnImpl } from "../entities/Column/ColumnImpl";
import { IColumn } from "../entities/Column/IColumn";
import { CommentImpl } from "../entities/Comment/CommentImpl";
import { IComment } from "../entities/Comment/IComment";
import { TaskImpl } from "../entities/Task/TaskImpl";

class StoreService {
  private authorNameKey = "author";
  private columnKey = "columns";
  private storage = window.localStorage;

  constructor() {
    const columns = this.getColumns();

    if (columns.length === 0) {
      this.addColumns([
        TODO_COLUMN_NAME,
        IN_PROGRESS_COLUMN_NAME,
        TESTING_COLUMN_NAME,
        DONE_COLUMN_NAME,
      ]);
    }
  }

  // Name store

  setName = (name: string): void => {
    this.storage.setItem(this.authorNameKey, name);
  };

  getName = (): string | null => {
    return this.storage.getItem(this.authorNameKey);
  };

  removeName = (): void => {
    this.storage.removeItem(this.authorNameKey);
  };

  // Columns store

  addColumns = (names: string[]): IColumn[] => {
    const columns = this.getColumns();

    names.forEach((name) => {
      columns.push(new ColumnImpl(name));
    });

    this.setColumns(columns);
    return columns;
  };

  getColumns = (): IColumn[] => {
    const value = this.storage.getItem(this.columnKey);
    if (value) {
      const columns = JSON.parse(value);
      return columns;
    }

    return [];
  };

  setColumns = (arr: IColumn[]): void => {
    this.storage.setItem(this.columnKey, JSON.stringify(arr));
  };

  removeColumns = (): void => {
    this.storage.removeItem(this.columnKey);
  };

  // Column store

  addColumn = (name: string): void => {
    const columns = this.getColumns();
    const taskList = new ColumnImpl(name);

    columns.push(taskList);
    this.setColumns(columns);
  };

  renameColumn = (id: string, name: string): void => {
    const columns = this.getColumns().map((c) => {
      if (c.id === id) {
        c.name = name;
      }
      return c;
    });

    this.setColumns(columns);
  };

  // Task store

  addTask = (name: string, columnId: string): void => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    const author = this.getName()!!;
    if (column) {
      const task = new TaskImpl(name, columnId, author);
      column.tasks.push(task);
    }

    this.setColumns(columns);
  };

  removeTask = (taskId: string, columnId: string): void => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    if (column) {
      column.tasks = column.tasks.filter((t) => taskId !== t.id);
    }

    this.setColumns(columns);
  };

  changeTaskDescription = (
    taskId: string,
    columnId: string,
    description: string
  ): void => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    if (column) {
      const task = column.tasks.find((t) => taskId === t.id);
      if (task) {
        task.description = description;
      }
    }

    this.setColumns(columns);
  };

  renameTask = (taskId: string, columnId: string, name: string): void => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    if (column) {
      const task = column.tasks.find((t) => taskId === t.id);
      if (task) {
        task.name = name;
      }
    }

    this.setColumns(columns);
  };

  // Comment Store

  addComment = (comment: string, taskId: string, columnId: string) => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    const task = column?.tasks.find((t) => taskId === t.id);
    task?.comments.push(new CommentImpl(comment, this.getName()!!));

    this.setColumns(columns);
  };

  getComments = (taskId: string, columnId: string) => {
    const column = this.getColumns().find((c) => columnId === c.id);
    const task = column?.tasks.find((t) => taskId === t.id);
    if (task?.comments) {
      return task?.comments;
    } else {
      return [];
    }
  };

  getAllComments = (): Map<
    string,
    { comments: IComment[]; commentsCount: number }
  > => {
    const columns = this.getColumns();
    const comments = new Map();
    columns.forEach((c) => {
      c.tasks.forEach((t) => {
        comments.set(t.id, {
          comments: t.comments,
          commentsCount: t.comments.length,
        });
      });
    });
    return comments;
  };

  changeComment = (
    taskId: string,
    columnId: string,
    commentId: string,
    text: string
  ) => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    if (column) {
      const task = column.tasks.find((t) => taskId === t.id);
      if (task) {
        task.comments = task.comments.map((c) => {
          if (commentId === c.id) {
            c.text = text;
          }
          return c;
        });
      }
    }

    this.setColumns(columns);
  };

  removeComment = (taskId: string, columnId: string, commentId: string) => {
    const columns = this.getColumns();
    const column = columns.find((c) => columnId === c.id);
    if (column) {
      const task = column.tasks.find((t) => taskId === t.id);
      if (task) {
        task.comments = task.comments.filter((c) => commentId !== c.id);
      }
    }

    this.setColumns(columns);
  };
}

export default new StoreService();
