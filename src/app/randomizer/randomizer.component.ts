import { Component, Input, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';

@Component({
  selector: 'app-randomizer',
  standalone: true,
  
  templateUrl: './randomizer.component.html',
  styleUrl: './randomizer.component.scss',
  
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
  ],
})
export class RandomizerComponent {

  @Input() traitList!: string[];

  selectedValues = [];

  randomizerInput = new FormGroup({
    
    levelControl : new FormControl(),
    categoryControl : new FormControl(),
    categoryFilterControl : new FormControl(),
    traitControl : new FormControl(),
    traitsFilterControl : new FormControl(),
    quantityControl : new FormControl(),
  });
 
  levelList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ];
  categoryList = ["action","ancestry","archetype","armor","article","background","class","creature","creature-family","deity","equipment","feat",
    "hazard", "rules","skill","shield","spell","source","trait","weapon","weapon-group"];

  OnInit() {

  }  
}
