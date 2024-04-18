import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToDo } from 'src/app/inteface/todo';

import { ToDoService } from 'src/app/service/to-do.service';
import {
  highlightedStateTrigger, shownStateTrigger, checkButtonTrigger, deleteTaskTrigger, filterTrigger,
  formButtonTrigger,
  txtAnimationTrigger, shakeTrigger,
  listStatetrigger} from '../animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  animations: [highlightedStateTrigger, shownStateTrigger, checkButtonTrigger, deleteTaskTrigger, filterTrigger, formButtonTrigger, txtAnimationTrigger, shakeTrigger, listStatetrigger]
})
export class ToDoListComponent implements OnInit {
  toDoList: ToDo[] = [];
  formAberto: boolean = false;
  category: string = '';
  validado: boolean = false;
  indexTarefa: number = -1;
  id: number = 0;
  campoBusca: string = '';
  tarefasFiltradas: ToDo[] = [];
  tarefasSubscription: Subscription = new Subscription()

  formulario: FormGroup = this.formBuilder.group({
    id: [0],
    description: ['', Validators.required],
    statusFinish: [false, Validators.required],
    category: ['', Validators.required],
    priority: ['', Validators.required],
  });

  constructor(
    private service: ToDoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service.list()
    this.tarefasSubscription = this.service.tarefas$.subscribe(tarefas => {
      this.toDoList = tarefas;
      this.tarefasFiltradas = tarefas;
    })
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  filtrarTarefaPorDescricao(description: string) {
    this.campoBusca = description.trim().toLowerCase()
    if(description) {
      this.tarefasFiltradas = this.toDoList.filter(todo =>
        todo.description.toLowerCase().includes(this.campoBusca)
      )
    } else {
      this.tarefasFiltradas = this.toDoList;
    }
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
    if(this.formulario.valid) {
      const tarefaEditada = this.formulario.value
      this.service.editar(tarefaEditada, true)
      this.resetarFormulario()
     }
  }

  criarTarefa() {
   if(this.formulario.valid) {
    const novaTarefa = this.formulario.value
    this.service.criar(novaTarefa)
    this.resetarFormulario
   }
  }

  excluirTarefa(tarefa: ToDo) {
    if (tarefa.id) {
      this.service.excluir(tarefa.id)
    }
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

  finalizarTarefa(tarefa: ToDo) {
    this.id = tarefa.id
      this.service.atualizarStatusTarefa(tarefa)
  }

}
