import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WriterComponent } from './writer/writer.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'writer', component: WriterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }