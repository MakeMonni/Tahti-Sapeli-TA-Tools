import { Component, OnInit, Input  } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pickbanmap',
  templateUrl: './pickbanmap.component.html',
  styleUrls: ['./pickbanmap.component.css']
})
export class PickbanmapComponent implements OnInit {

  @Input() mapData: any;

  constructor(     
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {

  }

}
