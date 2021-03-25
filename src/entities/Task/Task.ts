import { uuidv4 } from "../../utils/uuidv4";
import store from "../../utils/store";
import { Task } from "./ITask";

export class TaskImpl implements Task {
  id: string;
  name: string;
  position: number;
  columnId: string;
  author: string;

  constructor(name: string, position: number, columnId: string) {
    this.id = uuidv4();
    this.name = name;
    this.position = position;
    this.columnId = columnId;
    this.author = store.getName()!!;
  }
}
