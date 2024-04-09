import { animate, state, style, transition, trigger } from "@angular/animations";

export const highlightedStateTrigger = trigger('highlightedState', [
  state('default', style({
    border: '2px solid #B2B6FF'
  })),
  state('highlighted', style({
    border: '4px solid #B2B6FF',
    filter: 'brightness(92%)'
  })),
  transition('default => highlighted', [
    animate('200ms ease-out', style({
      transform: 'scale(1.02)'
    })),
    animate(350)
  ])
])

export const shownStateTrigger = trigger('shownState', [
// O METODO STATE QUE CHAMEI DE 'notshown' NAO FUNCIONOU PARA TRANSICAO ANIMADA DE ABERTURA DO FORM, POIS ELE NAO ESTA CARREGADO NO DOM, JA QUE ELE EH UM NGIF PARA RESONDER AO CLIQUE, POR ISSO COMENTEI ESSE CODIGO E SOLUCIONEI NO METODO TRANSITION COM O ESTADO VOID.
    // state('notShown', style({ })),

// STATE('SHOWN') RETIRADO PARA UTILIZACAO DO ESTADO CORINGA: * ONDE SUBSTITUI O SHOWN POR * NAS TRANSICOES COM VOID COMENTADOS NAS LINHAS 26 E 37
    // state('shown', style({ })),

//QUANDO ESTAMOS NA TRANSICAO DO ESTADO VOID PARA O ESTADO CORINGA, PODERMOS USAR O ACUCAR SINTATICO :enter - linha 29
  // transition('void => *', [])

  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(300, style({
      opacity: 1
    }))
  ]),

//QUANDO ESTAMOS NA TRANSICAO DO ESTADO CORINGA PARA O ESTADO VOID, PODEMOS USAR O ACUCAR SINTATICO :leave - linha 40
  // transition('* => void', [
  transition(':leave', [
    animate(300, style({
      opacity: 0
    }))
  ])
])
