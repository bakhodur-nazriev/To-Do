import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  searchTerm: string = '';
  newTodoTitle: string = '';
  editTodoId: number | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data: Todo[]) => {
      this.todos = data.sort((a, b) => b.id - a.id);
      this.filteredTodos = [...this.todos];
    });
  }

  deleteTodo(todoId: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
    this.filteredTodos = this.filteredTodos.filter(
      (todo) => todo.id !== todoId
    );
  }

  filterTodos(): void {
    this.filteredTodos = this.todos.filter((todo) =>
      todo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        userId: 1,
        id: Date.now(),
        title: this.newTodoTitle,
        completed: false,
      };
      this.todos.unshift(newTodo);
      this.todos.sort((a, b) => b.id - a.id);
      this.filterTodos();
      this.newTodoTitle = '';
    }
  }

  startEdit(todo: Todo): void {
    this.editTodoId = todo.id;
    this.newTodoTitle = todo.title;
  }

  cancelEdit(): void {
    this.editTodoId = null;
    this.newTodoTitle = '';
  }

  updateTodo(): void {
    if (this.newTodoTitle.trim() && this.editTodoId !== null) {
      this.todos = this.todos.map((todo) => {
        if (todo.id === this.editTodoId) {
          return { ...todo, title: this.newTodoTitle };
        }
        return todo;
      });
      this.filterTodos();
      this.editTodoId = null;
      this.newTodoTitle = '';
    }
  }

  toggleCompleted(todo: Todo): void {
    todo.completed = !todo.completed;
  }
}
