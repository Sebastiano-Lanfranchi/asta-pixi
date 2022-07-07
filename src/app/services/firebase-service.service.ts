import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Squad } from '../models/squad.model';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore) { }

  public CreateSquad(squad: Squad) {
    if(squad.nome == '')
    alert('compila il campo nome')
    else if(squad.crediti == 0)
    alert('aumentare il numero di crediti')
    else{
      Swal.fire({
      title: "Sicuro di voler aggiungere " + squad.nome + "?",
      text: "Aggiungerai questa squadra ai partecipanti all'asta",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aggiungi!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.db.collection('squadre').doc(squad.nome).set(Object.assign({}, squad)).then(() => {
          Swal.fire(
            'Aggiunta!',
            'La squadra è stata aggiunta correttamente.',
            'success'
          )
        });
      }
    })
    }

    
  }
}

