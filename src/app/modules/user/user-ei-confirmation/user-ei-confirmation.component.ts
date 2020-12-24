import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UsersServiceService } from '../../../services/user/users-service.service';
import { BaseService } from '../../../services/base/base.service';
import { GenericFormValidationService } from '../../../services/common/generic-form-validation.service';
import { EiServiceService } from '../../../services/EI/ei-service.service';
import { FormBuilder } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner"; 
declare var $: any;

@Component({
  selector: 'app-user-ei-confirmation',
  templateUrl: './user-ei-confirmation.component.html',
  styleUrls: ['./user-ei-confirmation.component.css']
})
export class UserEiConfirmationComponent implements OnInit {
  model: any = {};
  /*Using Validation For Manage Error Concept*/
  error: any = [];
  errorDisplay: any = {};
  errorOtpModelDisplay: any;
  confirmationDetails:any=[];
  /*Qualification Master*/
  studentsConfirmation: any = [];
  school_id:any="";
  constructor(private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    public userService: UsersServiceService,
    public baseService: BaseService,
    public eiService:EiServiceService,
    private genericFormValidationService:GenericFormValidationService,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(parrams=>{
      if(parrams['school_id']){
          this.school_id = parrams['school_id'];
      }
    })
    this.getConfirmationDetails();
  }
  

  goToUserProfileCreatedPage() {
    this.router.navigate(['user/profile-created']);
 }
 addPastEi(){
  this.router.navigate(['user/add-ei'],{queryParams:{"title":"past"}});
 }
 addAnotherCourse(){
  this.router.navigate(['user/add-more-standard'],{queryParams:{"school_id":this.school_id }});
 }
 getConfirmationDetails(){
  try{
    this.SpinnerService.show(); 
   
    this.baseService.getData('user/get-ei-course-confirmation-list/').subscribe(res => {
      
          let response:any={};
          response=res;
          if(response.status==true){
            this.SpinnerService.hide(); 
            this.confirmationDetails=response.data;
          }else{
            this.SpinnerService.hide(); 
          }
       },(error) => {
        this.SpinnerService.hide(); 
        console.log(error);
        
      });
  }catch(err){
    this.SpinnerService.hide(); 
    console.log(err);
  }
 }
}
