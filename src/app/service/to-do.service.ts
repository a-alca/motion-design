import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDo } from '../inteface/todo';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private readonly API = 'http://localhost:3000/todos';
  constructor(private http: HttpClient) { }

  show(category: string): Observable<ToDo[]> {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      _order: 'desc',
    });
    if(category) {
      params = params.append('category', category);
    }
    return this.http.get<ToDo[]>(this.API, { params })
  }

  buscarPorId(id: number): Observable<ToDo> {
    const url = `${this.API}/${id}`;
    return this.http.get<ToDo>(url)
  }

  atualizarStatusTarefa(todo: ToDo): Observable<ToDo> {
    todo.statusFinish = !todo.statusFinish;
    return this.editar(todo);
  }

  criar(todo: ToDo): Observable<ToDo> {
    return this.http.post<ToDo>(this.API, todo);
  }

  editar(todo: ToDo): Observable<ToDo> {
    const url = `${this.API}/${todo.id}`;
    return this.http.put<ToDo>(url, todo);
  }

  excluir(id: number): Observable<ToDo> {
    const url = `${this.API}/${id}`;
    return this.http.delete<ToDo>(url)
  }
}
