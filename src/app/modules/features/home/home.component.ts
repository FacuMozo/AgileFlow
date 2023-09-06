import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../core/services/projects/projects.service';
import { StoriesService } from '../../core/services/stories/stories.service';
import { Project } from '../../models/cproject.model';
import { Story } from '../../models/cstory.model';
import { MatDialog } from '@angular/material/dialog';
import { StoryFormComponent } from '../story-form/story-form.component';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProjectDialogComponent } from '../../shared/project-dialog/project-dialog.component';
import { DialogNotificationComponent } from '../../shared/dialog-notification/dialog-notification.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  
  projects : Project[]=[];
  errorGetProjects: boolean = false;
  cantProjectsIsZero: boolean = false;

  
  stories: Story[]=[];
  cantStoriesIsZero: boolean = false;
  errorGetStories : boolean = false;

  constructor( private projectsService : ProjectsService,
              private storiesService:StoriesService,
              public dialog: MatDialog){}

  ngOnInit(): void {
      this.getStories();
      this.getProjects();
  }

  getStories(){
    this.storiesService.getAllStories().subscribe(response => {
      if(response.status == "success"){
        this.stories = response.data;
        this.errorGetStories = false
        if(this.stories.length == 0){
          this.cantStoriesIsZero = true;
        }else{
          this.cantStoriesIsZero = false;

        }
      }else{
        this.errorGetStories = true;
      }
    })
  }

  getProjects() {
    this.projectsService.getProjectApi().subscribe(resp => {
      if (resp.status == "success") {
        this.projects = resp.data;
        this.errorGetProjects = false;
        if (this.projects.length == 0) {
          this.cantProjectsIsZero = true;
        } else {
          this.cantProjectsIsZero = false;
        }
      } else {
        this.errorGetProjects = true;
      }
    });
  }

  updateStory(story : Story){
      let dialogRef = this.dialog.open(StoryFormComponent, {
        data: { name: story.name, description: story.description, epic: story.epic, sprint: story.sprint, owner: story.owner, assignedTo: story.assignedTo, points: story.points, created: story.created, due: story.due, start: story.started, end: story.finished, status: story.status, option: 'Edit' }
      })
  
      dialogRef.afterClosed().subscribe(result => {
  
        if (result.value != undefined) {
          const loading = this.dialog.open(LoadingDialogComponent)
          this.storiesService.editStory(result.value, story.getId()).subscribe(resp => {
            loading.close()
            if (resp.status == "success") {
              this.getStories();
              this.dialog.open(DialogNotificationComponent, {
                data: { title: "Success editing Storie: " + result.value.name, mensaje: "The storie has been edited" }
              })
            } else {
              this.dialog.open(DialogNotificationComponent, {
                data: { title: "Error editing Storie: " + result.value.name, mensaje: "Error in comunication with Database." }
              })
  
            }
          })
        }
      })
    
  }

  updateProject(project: Project): void {
    let dialogRef = this.dialog.open(ProjectDialogComponent, {
      data: {
        option: " Editar", name: project.getName(),
        members: project.getMembers(), description: project.getDescription(),
        icon: project.icon
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result.value != undefined){

        const loading = this.dialog.open(LoadingDialogComponent)
        //loading true
        this.projectsService.editProject(result.value, project.getId()).subscribe(resp => {
          loading.close()
          if (resp.success = "success") {
            this.getProjects();
            //loading false
            this.dialog.open(DialogNotificationComponent,{
              data: { title: "Success editing Project", mensaje: "This project has been edited" }});
          }else{
            this.dialog.open(DialogNotificationComponent,{
              data: { title: "Error editing Project", mensaje: "Error in comunication with Database" }});
          }
        });
      }
      
    })
  }
  
}
