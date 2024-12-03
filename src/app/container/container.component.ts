import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RandomizerComponent } from '../randomizer/randomizer.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule, FormControl, FormBuilder} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { config } from "../config";
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-container',
  standalone: true,
  
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',

  imports: [
    RandomizerComponent,

    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule
  ],
})

export class ContainerComponent implements OnInit{ 

  name:string;
  @ViewChildren(RandomizerComponent) _childComponents: QueryList<RandomizerComponent>;

  constructor(private http: HttpClient, private fb: FormBuilder, private domSanitizer : DomSanitizer) {
    this.name = "testing"
   }

  generatorsControl = new FormControl("1");
  resVal = new Array<SafeHtml>();
  traitList = [""];
  getWholeList = false;

  private queryStringBase = `{
    "size" : 9999,
    "query" : {
      "bool" : {
        "must" : [
          **insert**
        ]
      }
    }
  }`;

  private partialHeader = `
    {
      "bool" : {
        "should" : [
          **insert**
        ]
      }					
    }`;

  ngOnInit() {
    this.resVal.push("Generate some things!");
    delete this.traitList[0];
    this.getTraitList();
    this.getWholeList = false;
  }

  public generateThatShit () {

    for(var component of  this._childComponents) {

      var queryFieldSubArray = new Array<string>();
      var inputFields = Object.entries(component.randomizerInput.value);

      //entry[0] is the name, entry[1] is the value
      for(var field of inputFields) {

        var termsArray = new Array<string>();
        termsArray

        if(field[1] != null 
          && !field[0].includes("Filter")
          && !field[0].includes("quantity")) {
          var name = field[0].replace("Control", "");
          
          const array = Object.keys(field[1]).map((key) => ({key, value: field[1][key] }));

          for(var term of array) {
              var termString = `{"term" : {"${name}" : "${term.value}" }}`;
              termsArray.push(termString);
          }

          var termString = termsArray.join(",");
          var termsQueryString = this.partialHeader.replace("**insert**", termString);
          queryFieldSubArray.push(termsQueryString);
        }
      }

      var bigString = queryFieldSubArray.join(",");
      var entireQuery = this.queryStringBase.replace("**insert**", bigString);

      var queryJson = JSON.parse(entireQuery);

      this.http.post(config.fullUrl, queryJson)
      .subscribe((response : any) => {
        
        if(this.getWholeList) {
          for(let hit of response.hits.hits) {
            if(hit._source.remaster_name) {
              this.resVal.push(hit._source.remaster_name);
            } else {
              this.resVal.push(hit._source.name);
            }
          }
        } else { // !getWholeList (randomizing)
          var size = response.hits.hits.length;
          if (size > 0) {
    
            var answer = this.randomIntFromInterval(0, size)

            var outString ="";
            let name = "";
            let url = response.hits.hits[answer]._source.url;

            if(response.hits.hits[answer]._source.remaster_name) {
              name = response.hits.hits[answer]._source.remaster_name;
            } else {
              name = response.hits.hits[answer]._source.name
            }

            outString = `<a href=\"https://2e.aonprd.com/${url}\">${name} </a>`;

            this.resVal.push(this.domSanitizer.bypassSecurityTrustHtml(outString));
          }
        }
      });
    }


    this.resVal = [];
  }

  async getTraitList() {

    
    const traitFetchConst = {
      aggs : {
          traitList : {
              terms : { field: "trait", size:10000 }
          }
      },
      size : 0
    }

    this.http.post(config.fullUrl, traitFetchConst)
      .subscribe((response : any) => {

        for(var trait of response.aggregations.traitList.buckets) {
          if(trait && trait.key.trim() != ""){
            this.traitList.push(trait.key);
          }
          
        }
      });
  }

  randomIntFromInterval(min : any, max : any) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
