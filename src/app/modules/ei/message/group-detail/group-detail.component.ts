import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/app/services/base/base.service';
import { EiServiceService } from 'src/app/services/EI/ei-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from "@angular/forms";
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  groupUserLists:any=[];
  model:any={};
  noOfUsers:any=0;
  serverImageUrl: any;
  params:any={}
  receipentUsers: any=[];
  recepintDetails: any;
  currentUser: string;
  exitGroupMember: number=0;
  is_check_student:any;
  is_admin:any;
  is_check_admin: any=0;
  groupMember:any=[];
  constructor( private router: Router,
    private location: Location,
    private loader: NgxSpinnerService,
    public eiService: EiServiceService,
    public baseService: BaseService,
    public formBuilder: FormBuilder,
    private alert: NotificationService,
    private route: ActivatedRoute,
     
    private firestore: AngularFirestore,) { }

  ngOnInit(): void {
    this.serverImageUrl = environment.serverImagePath;
    this.currentUser = localStorage.getItem("fbtoken");
    this.route.queryParams.subscribe(params=>{
      this.params=params;
    })
    if(this.params.groupId && this.params.chat && !this.params.editgroup)
    {
      const groupD = this.firestore.collection("group").doc(this.params.groupId).valueChanges()
      const groupDd=groupD.subscribe((res:any)=>{
        
       // console.log(res);
        this.model=res;
        
        res.reciepent.forEach(element => {
         // console.log(localStorage.getItem("fbtoken"));
          if(element[this.currentUser]){
            if(element[this.currentUser].is_exit==1){
              this.exitGroupMember=1;
              //console.log(this.exitGroupMember);
              
            }
            if(element[this.currentUser].is_student){
              this.is_check_student=element[this.currentUser].is_student;
              //console.log(this.exitGroupMember);
              
            }
            if(element[this.currentUser].is_admin==1){
              this.is_admin=element[this.currentUser].is_admin;
              //console.log(this.exitGroupMember);
              
            }
            
          }
          
          Object.keys(element).forEach(el=>{
            if(element[el].is_remove==0 && element[el].is_exit==0){
              this.groupMember[el]=element[el];
              this.getRecepintUserDetails(el,'group');
             // console.log(el);
            }
          // console.log(this.groupMember);
           
          })
          
        });
      })
      
    }else{
      if(localStorage.getItem("groupUsers"))
      {
        var groupListMember=[];
        groupListMember=JSON.parse(localStorage.getItem("groupUsers"));
        var recepient=[];
        groupListMember.forEach(element => {
          let user_recepient: any = {};
          let objGroupData: any = {};
          objGroupData.is_read = 0;
          objGroupData.is_admin = 0;
          objGroupData.is_remove = 0;
          objGroupData.is_remove_date = "";
          objGroupData.is_exit = 0;
          objGroupData.is_exit_date = "";
          objGroupData.is_student = element.student_id ? 0 : 1;
          if (element.firebase_id) {
            user_recepient[element.firebase_id] = objGroupData;
            recepient.push(user_recepient)
          }

        });
        //console.log("list of group",recepient);
        this.firestore.collection('group').get().subscribe(querySnapshot => {
          if (querySnapshot.docs.length > 0) {
            querySnapshot.docs.map(doc => {
            
              let res:any=[]
              res=doc.data();
              if(doc.id==this.params.groupId){
                //this.model=res;
                var aG=[]
                res.reciepent.forEach(element => {
                  Object.keys(element).forEach(eOld=>{
                    aG[eOld]=element[eOld];
                    
                  })
                 
              
                });
                //console.log("sdsdsd",aG);
                var newGroupList=[];
                recepient.forEach(el=>{
                  Object.keys(el).forEach(e=>{
                    if(aG[e]){
                      //aG[e].is_remove=0;
                     // aG[e].is_exit=0;
                      newGroupList.push(el)
                      delete aG[e] 
                      
                    }else{
                      newGroupList.push(el)
                     
                    }
                    
                    
                  })
                })
                Object.keys(aG).forEach(item=>{
                  var data={}
                  data[item]=aG[item]
                  newGroupList.push(data)
                })
                this.model=res;
                this.model.reciepent=newGroupList;
               // console.log(newGroupList);
                
                this.firestore.collection("group").doc(this.params.groupId).set(this.model).then((responce:any)=>{
                  //console.log("sdfghjk",responce);
                  this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
                  
                  },(error)=>{
            
                  })
              
                
              }});}});
         
      
          
        
      }
    }
  }
  goBack() {
    this.location.back()
  }
  getRecepintUserDetails(uuid,text:any='') {
    if(text=='group'){
      //this.receipentUsers.push(k)
      localStorage.setItem("receipent",uuid);
      this.firestore.collection('users').doc(uuid).ref.get().then(res => {
     // this.recepintDetails = res.data();
     let resp:any={}
     resp = res.data()
     if(!this.receipentUsers.find(responce=>{return responce.id==resp.id}))
      this.receipentUsers.push(resp )
      localStorage.setItem("alreadyGroupMember",JSON.stringify(this.receipentUsers));
      });
     
      this.noOfUsers=this.receipentUsers.length;
    }else{
     // localStorage.setItem("receipent",uuid);
      this.firestore.collection('users').doc(uuid).ref.get().then(res => {
        this.recepintDetails = res.data();
      });
    }
   
  }
  updateDetails(){
    this.firestore.collection("group").doc(this.params.groupId).set(this.model).then((responce:any)=>{
      //console.log(responce);
      this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
      
      },(error)=>{

      }) 

      
      
    
  }
  isAdmin(user_uuid,type){
    if(type=='add'){
      this.firestore.collection('group').get().subscribe(querySnapshot => {
        //console.log("hjjh",querySnapshot.docs);
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs.map(doc => {
          
            let res:any=[]
            res=doc.data();
           
            if(doc.id==this.params.groupId){
              this.model=res;
              res.reciepent.forEach(element => {
                
                if(element[user_uuid]){
                  element[user_uuid].is_admin=1;
                }
                
              });
               
              this.firestore.collection("group").doc(this.params.groupId).set(res).then((responce:any)=>{
            
              this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
              
            },(error)=>{
      
            }) 
            } });
        }

      });
      
    }else{
      this.firestore.collection('group').get()
         
      .subscribe(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs.map(doc => {
          
            let res:any=[]
            res=doc.data();
            if(doc.id==this.params.groupId){
              this.model=res;
              res.reciepent.forEach(element => {
                //console.log(element);
                if(element[user_uuid]){
                  element[user_uuid].is_admin=0;
                }
                
              });
               
              this.firestore.collection("group").doc(this.params.groupId).set(res).then((responce:any)=>{
               
              this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
              
            },(error)=>{
      
            }) 
            }});
        }

      });
     }
  }
  exitGroup(user_uuid,type){
    console.log(user_uuid);
    if(type=='exit'){
      this.firestore.collection('group').get().subscribe(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs.map(doc => {
          
            let res:any=[]
            res=doc.data();
            if(doc.id==this.params.groupId){
              this.model=res;
              res.reciepent.forEach(element => {
                //console.log(element);
                if(element[user_uuid]){
                  element[user_uuid].is_exit=1;
                }
                
              });
              this.firestore.collection("group").doc(this.params.groupId).set(res).then((responce:any)=>{
              this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
              
            },(error)=>{
      
            })}});}});
      
    }else{
      this.firestore.collection('group').get()
         
      .subscribe(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs.map(doc => {
          
            let res:any=[]
            res=doc.data();
            if(doc.id==this.params.groupId){
              this.model=res;
              res.reciepent.forEach(element => {
                //console.log(element);
                if(element[user_uuid]){
                  element[user_uuid].is_remove=1;
                }
                
              });
              //console.log((res));
              this.firestore.collection("group").doc(this.params.groupId).set(res).then((responce:any)=>{
              //console.log(responce);
              this.router.navigate(['ei/messages-details'],{queryParams:{"chat":"group"}});
              
            },(error)=>{
      
            }) 
            }
          
            
            
            
          });
        }

      });
      // this.firestore.collection("group").doc(this.params.groupId).get().subscribe((rr:any)=>{
      //   rr.docs.map(query=>{
      //     console.log(query);
          
      //   });
        
      // })
      // this.firestore.collection("group").doc(this.params.groupId).valueChanges().subscribe((res:any)=>{
      //   //console.log(res);
      //  this.model=res;
      //   this.noOfUsers=res.reciepent.length;
      
      
      //   console.log(res);
        
      // })
      
  
    }
   
  }
   /** 
   * Function Name : fileUploadDocument
  */
    fileUploadDocument(files) {
      let fileList: FileList = files;
      let fileData: File = fileList[0];
      if (fileData.type !== 'image/jpeg' && fileData.type !== 'image/jpg' && fileData.type !== 'image/png' && fileData.type !== 'application/pdf') {
        this.loader.hide();
        this.alert.error("File format not supported", 'Error');
         
        return
      }
      const formData = new FormData();
      formData.append('file_name', fileData);
      try {
        this.loader.show();
        this.eiService.uploadFile(formData).subscribe(
          (res: any) => {
            if (res.status == true) {
              this.loader.hide();
              this.model.group_icon = this.serverImageUrl+res.filename
             return res.filename;
            } else {
              this.loader.hide();
              var collection = this.eiService.getErrorResponse(this.loader, res.error);
              this.alert.error(collection, 'Error')
              return '';
            }
          }, (error) => {
            this.loader.hide();
            this.alert.error(error.message, 'Error')
            return '';
          });
      } catch (err) {
        this.loader.hide();
        this.alert.error(err, 'Error')
      }
    }
addMoreRecipant(){
  this.router.navigate(['ei/group-chat'],{queryParams:{"editgroup":"edit","groupId":this.params.groupId}});
  //group-chat?newgrp=C
}
}
