import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment'
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header-components/header.component';
import { SquadreGenComponent } from './components/squadre-gen/squadre-gen.component';
import { EstrazioneComponent } from './components/estrazione/estrazione.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SquadreGenComponent,
    EstrazioneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
