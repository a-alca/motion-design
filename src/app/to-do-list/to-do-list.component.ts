import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDo } from 'src/app/inteface/todo';

import { ToDoService } from 'src/app/service/to-do.service';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {
  toDoList: ToDo[] = [];
  formAberto: boolean = false;
  category: string = '';
  validado: boolean = false;
  indexTarefa: number = -1;
  id: number = 0;

  formulario: FormGroup = this.formBuilder.group({
    id: [0],
    description: ['', Validators.required],
    statusFinish: [false, Validators.required],
    category: ['', Validators.required],
    priority: ['', Validators.required],
  });

  constructor(
    private service: ToDoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): ToDo[] {
      this.service.list(this.category).subscribe((toDoList) => {
        this.toDoList = toDoList;
      });
      return this.toDoList
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  resetarFormulario() {
    this.formulario.reset({
      desciption: '',
      statusFinish: false,
      category: '',
      priority: '',
    });
  }

  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }

  salvarTarefa() {
    if (this.formulario.value.id) {
      this.editarTarefa();
    } else {
      this.criarTarefa();
    }
  }

  editarTarefa() {
    this.service.editar(this.formulario.value).subscribe({
      complete: () => this.atualizarComponente(),
    });
  }

  criarTarefa() {
    this.service.criar(this.formulario.value).subscribe({
      complete: () => this.atualizarComponente(),
    });
  }

  excluirTarefa(id: number) {
    if (id) {
      this.service.excluir(id).subscribe({
        complete: () => this.recarregarComponente(),
      })
    }
  }

  atualizarComponente() {
    this.recarregarComponente();
    this.resetarFormulario();
  }

  recarregarComponente() {
    this.router.navigate(['/toDoList']);
  }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((todo) => {
      this.formulario = this.formBuilder.group({
        id: [todo.id],
        description: [todo.description],
        category: [todo.category],
        statusFinish: [todo.statusFinish],
        priority: [todo.priority],
      });
    });
    this.formAberto = true;
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto = false;
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  finalizarTarefa(id: number) {
    this.service.buscarPorId(id!).subscribe((todo) => {
      this.service.atualizarStatusTarefa(todo).subscribe(() => {
        this.listarAposCheck();
      });
    });
  }

  listarAposCheck() {
    this.service.list(this.category).subscribe((toDoList) => {
      this.toDoList = this.toDoList
    });
  }

}
