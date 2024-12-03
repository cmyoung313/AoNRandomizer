import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RandomizerComponent } from './randomizer/randomizer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ContainerComponent } from './container/container.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RandomizerComponent,
    ContainerComponent
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
