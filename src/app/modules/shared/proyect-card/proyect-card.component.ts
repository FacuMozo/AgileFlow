import { Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { Project } from '../../models/cproject.model';
import { User } from '../../models/user.model';
import { UserService } from '../../core/services/user.service';
@Component({
  selector: 'app-proyect-card',
  templateUrl: './proyect-card.component.html',
  styleUrls: ['./proyect-card.component.scss']
})
export class ProyectCardComponent implements OnInit{


  @Input() project!: Project;
  @Input() mostrarDelete: boolean = false;
  users: User[]=[];

  @Output() editOutPut = new EventEmitter();
  @Output() deleteOutPut = new EventEmitter();

  constructor(private uS:UserService){}

  ngOnInit(): void {
    this.getUsers();
  }

  editEvent(){
    console.log("editEvent");
    
    this.editOutPut.emit()
  }
  
  deleteEvent(){
    console.log("deleteEvent");
    
    this.deleteOutPut.emit()

  }

  getMembersOfProject(ids: string[]): User[] {
    if (this.users.length > 0){
      return this.users.filter(user => ids.includes(user._id));
    }
    return [];
  }

  getUsers() {
    this.uS.getUsers().subscribe(
      users => {
        this.users = users;
      })
  }
}
