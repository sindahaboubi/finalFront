import { animate, state, style, transition, trigger } from "@angular/animations";
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Sprint } from "src/app/model/sprint";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { SprintService } from "src/app/service/sprint.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AjouterTicketHistoireFormComponent } from "../ajouter-ticket-histoire-form/ajouter-ticket-histoire-form.component";
import { AjouterSprintFormComponent } from "../ajouter-sprint-form/ajouter-sprint-form.component";

const  updateTicketPositionUrl = "http://localhost:9999/gestion-histoire-ticket/histoireTickets/position";

@Component({
  selector: "app-icons",
  templateUrl: "icons.component.html",
  styleUrls: ['./icons.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':enter', [
        style({ width:  '*'}),
        animate('2.5s ease-in', style({ width: '*'}))
      ])
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInSprint', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(12%)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]

})

export class IconsComponent implements OnInit {
  constructor(private histoireTicketService:HistoireTicketService,private httpClient:HttpClient,
    private sprintService:SprintService, private dialog: MatDialog) {}

  histoireTickets:TicketHistoire[];
  sprints:Sprint[];
  histoireTicketsByProjetId:TicketHistoire[];

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  drop(event: CdkDragDrop<TicketHistoire[]>) {

      const ticketId = event.previousContainer.data[event.previousIndex].id; // récupère l'ID du ticket
      const newPosition = event.currentIndex; // récupère la nouvelle position
      console.log("id = "+ticketId+", new Position = "+newPosition);
      this.httpClient.put(updateTicketPositionUrl, { id: ticketId, position: newPosition })
        .subscribe(
          response => console.log('Position updated successfully!'),
          error => console.error('Error updating position: ', error)
        );
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
  }

  elementCreated:boolean = false;
  @ViewChild('detailElement') detailElementRef!: ElementRef;
  @ViewChild('newElement') newElementRef!: ElementRef;
  @ViewChild('doneList') doneList!: CdkDropList;

  basculerElement(){
    this.elementCreated = !this.elementCreated;
    if(this.elementCreated){
      this.detailElementRef.nativeElement.classList.remove('col-lg-12');
      this.detailElementRef.nativeElement.classList.add('col-lg-7');


    }else{
      this.detailElementRef.nativeElement.classList.remove('col-lg-7');
      this.detailElementRef.nativeElement.classList.add('col-lg-12');
      this.detailElementRef.nativeElement.setAttribute('[@fadeOut]');
    }
  }

  clickCount = 0;
  move(){
    // this.onCreateNewSprint();
    this.clickCount++;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AjouterTicketHistoireFormComponent, {
      width: '600px',
      height:'500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogCreateSprint() {
    const dialogRef = this.dialog.open(AjouterSprintFormComponent, {
      width: '500',
      height:'400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.histoireTicketService.getListHistoireTicketByProductBacklog(1).subscribe(
      data => {
        this.histoireTickets = data ;
      }
    );

    this.sprintService.getListSprintsByProductBacklog(1).subscribe(
      data => {
        this.sprints = data ;
      }
    );

    this.histoireTicketService.getListHistoireTicketByProjet(1).subscribe(
      data => {
        this.histoireTicketsByProjetId = data ;
      }
    );
  }

}
