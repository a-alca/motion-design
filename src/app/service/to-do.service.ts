import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToDo } from '../inteface/todo';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private readonly API = 'http://localhost:3000/todos';
  private tarefasSubject = new BehaviorSubject<ToDo[]>([]);
  tarefas$ = this.tarefasSubject.asObservable()
  constructor(private http: HttpClient) { }

  list(): void {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      // _order: 'description',
    });
    this.http.get<ToDo[]>(this.API, { params }).subscribe((tarefas) => {
      let tarefasTemporarias = this.tarefasSubject.getValue()
      tarefasTemporarias = tarefasTemporarias.concat(tarefas)
      this.tarefasSubject.next(tarefasTemporarias)
    })
  }

  buscarPorId(id: number): Observable<ToDo> {
    const url = `${this.API}/${id}`;
    return this.http.get<ToDo>(url)
  }

  atualizarStatusTarefa(todo: ToDo): void {
    todo.statusFinish = !todo.statusFinish;
    this.editar(todo, false);
  }

  criar(todo: ToDo): void {
    this.http.post<ToDo>(this.API, todo).subscribe(novaTarefa => {
      const tarefas = this.tarefasSubject.getValue()
      tarefas.unshift(novaTarefa)
      this.tarefasSubject.next(tarefas)
    });
  }

  editar(todo: ToDo, atualizarSubject: boolean): void {
    const url = `${this.API}/${todo.id}`;
    this.http.put<ToDo>(url, todo).subscribe(tarefaEditada => {
      if(atualizarSubject) {
        const tarefas = this.tarefasSubject.getValue()
        const index = tarefas.findIndex(tarefa => tarefa.id === tarefaEditada.id)
        if(index !== -1) {
          tarefas[index] = tarefaEditada
          this.tarefasSubject.next(tarefas)
        }
      }
    })
  }

  excluir(id: number): void {
    const url = `${this.API}/${id}`;
    this.http.delete<ToDo>(url).subscribe(() => {
      const tarefas = this.tarefasSubject.getValue()
      const index = tarefas.findIndex(tarefa => tarefa.id === id)
      if(index !== -1) {
        tarefas.splice(index, 1)
        this.tarefasSubject.next(tarefas)
      }
    })
  }
}
