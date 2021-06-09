import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-personal-messages',
  templateUrl: './personal-messages.component.html',
  styleUrls: ['./personal-messages.component.css']
})
export class PersonalMessagesComponent implements OnInit {
  isLoggedIn: boolean;
  messageData: any = [];
  currentUser: any = "";
  ids: Array<any> = [];
  recepintDetails:any={};
  conversation:any=[];
  dataStudent:any=[];
  objStudent:any={};
  lastMessageData:any=[];
  groupList:any=[];
  lastGroupmsg: any=[];
  groupexit: number=0;
  setting_user:any={'online':true,'is_seen':true,'is_read':true}
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private notifypush: FirebaseService,
    private baseService: BaseService

  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.baseService.isLoggedIn();
    this.currentUser = localStorage.getItem("fbtoken");
    if(this.currentUser){
      this.firestore.collection('setting').doc(this.currentUser).valueChanges().subscribe((res:any)=>{
        if(res){
          console.log(res.setting);
          
          this.setting_user=res.setting;
        }
      })
    }
    this. getGroupDetails(this.currentUser)
    if (this.isLoggedIn) {
      this.notifypush.receiveMessage();
      this.notifypush.requestPermission();
      if (localStorage.getItem("fbtoken")) {
        this.currentUser = localStorage.getItem("fbtoken");
        this.getUsersWithModeratorRole(localStorage.getItem("fbtoken"));
      }
    }

  }

  getUsersWithModeratorRole(loginfirebase_id) {
    var that = this;
    //.where('user_accept_id', '==', loginfirebase_id)
    that.ids.push(this.firestore.collection('user_friend_list').ref.where('user_request_id', '==', loginfirebase_id ).get().then(res => {
      return res.docChanges().map(doc => {
         return doc.doc.id;
      })
    }))

    that.ids.push(this.firestore.collection('user_friend_list').ref.where('user_accept_id', '==', loginfirebase_id ).get().then(res => {
      return res.docChanges().map(doc => {
        return doc.doc.id;
      })
    }))
    this.getMessageList()
  }
  createChatGroup(){
    localStorage.removeItem("groupclasscheck")
      localStorage.removeItem("sections")
      localStorage.removeItem("standardIds")
      localStorage.removeItem("courseIds")
      localStorage.removeItem("teachers")
    this.router.navigate(["ei/group-chat"],{queryParams:{"newgrp":"C"}});
  }
  getMessageList() {
    
    //this.messageData = [];
    this.ids.forEach(elem =>{
      elem.then((res: any) => {
        res.forEach(element => {
          var user_friend = "";
          this.firestore.collection('chat_conversation').doc(element).valueChanges().subscribe((res1:any)=>{
            
            if(res1){
              if(user_friend!=element){
                  this.firestore.collection('user_friend_list').doc(element).get().toPromise().then((resRecepent:any)=>{
                    var uuid = ''
                    if(resRecepent.data().user_request_id==this.currentUser && resRecepent.data().user_accept_id!=this.currentUser){
                      uuid = resRecepent.data().user_accept_id;
                    }
                    if(resRecepent.data().user_accept_id==this.currentUser && resRecepent.data().user_request_id!=this.currentUser){
                      uuid = resRecepent.data().user_request_id;
                    }
                    this.firestore.collection('users').doc(uuid).ref.get().then(res => {
                      this.recepintDetails = res.data();
                      res1.data[res1.data.length-1].uuid = uuid;
                      res1.data[res1.data.length-1].class_name = this.recepintDetails.class_name;
                      res1.data[res1.data.length-1].roll_no = this.recepintDetails.roll_no;
                      res1.data[res1.data.length-1].profile_pic = this.recepintDetails.photoUrl;
                      res1.data[res1.data.length-1].user_name = this.recepintDetails.firstName+' '+(!this.recepintDetails.lastName?'':this.recepintDetails.lastName);
                      this.lastMessageData.push(res1.data[res1.data.length-1]); 
                    });
                 })
                  user_friend=element;
                }
                
              }
          })

        //  var data = this.firestore.collection('chat_conversation').doc(element).get().toPromise().then((res: any) => {
        //     if (res.data())
        //       return res.data()
        //   });
        //   data.then(res => {
        //     if (res)
        //       this.messageData.push(res.data);
            
        //   })
        });
      })
    })
    
  }
  goToChatScreen(fbid,frndListId,chatConversion:any) {
    this.conversation = [];
    this.dataStudent =[];
    localStorage.setItem('friendlidt_id',frndListId);
    this.getRecepintUserDetails(fbid)
    return new Promise<any>((resolve, reject) => {
      let data: any = {};
      var date = new Date();

      var uuid =fbid;
      data.user_request_id = localStorage.getItem('fbtoken');
      data.user_accept_id = uuid;
      data.is_block = 0
      data.is_seen = 0
      data.is_active = 1
      data.is_read = 0
      data.created_on = this.baseService.getDateFormat(date);
      this.getFriendListBySender(localStorage.getItem('fbtoken'), uuid, data,chatConversion)
    })


  }
  getFriendListBySender(loginfirebase_id: any, user_accept_id: any, data,chatConversion:any) {
    this.conversation = [];
    this.dataStudent = [];
    this.firestore.collection('user_friend_list').valueChanges().subscribe((res:any)=>{
      let dataEle = res.find(elem=>{
                      return ((elem.user_request_id===loginfirebase_id && elem.user_accept_id===user_accept_id) || (elem.user_request_id===user_accept_id && elem.user_accept_id===loginfirebase_id))  
                    })
           
      if(dataEle){
        
        this.firestore.collection('user_friend_list').get()
         
        .subscribe(querySnapshot => {
          if (querySnapshot.docs.length > 0) {
            querySnapshot.docs.map(doc => {
            
              let res:any=[]
              res=doc.data();
             if(dataEle.user_request_id==res.user_request_id && dataEle.user_accept_id== res.user_accept_id)
             {
              localStorage.setItem("friendlidt_id", doc.id)
              this. getDocumentsChat(chatConversion);
              
             }
              
            });
          }
  
        });
      } else{
        this.firestore.collection("user_friend_list").add(data).then(res => {
          localStorage.setItem("friendlidt_id",res.id)
           this. getDocumentsChat(chatConversion);
          
         })
      }             
     
      
    })
     
       
       }

  setUserSettingOnFirebase(event,type){
   console.log(event,this.currentUser,type );
   if(event){
    if(type=='online'){
      this.setting_user.online=event;
    }else if(type=='last_seen'){
      this.setting_user.is_seen=event;
    }else if(type=='is_read'){
      this.setting_user.is_read=event;
    }
   }else{
    if(type=='online'){
      this.setting_user.online=event;
    }else if(type=='last_seen'){
      this.setting_user.is_seen=event;
    }else if(type=='is_read'){
      this.setting_user.is_read=event;
    }
   }
   console.log( this.setting_user);
   
   
    this.firestore.collection('setting').doc(this.currentUser).set({
      setting: this.setting_user 
     })
  }     
  getDocumentsChat(chatConversion) {
    console.log(chatConversion);
    
    this.conversation = [];
    this.dataStudent =[];
    var uuid= localStorage.getItem("friendlidt_id");
    var dataSet=this.firestore.collection('chat_conversation').doc(uuid).valueChanges();
    dataSet.subscribe((res:any)=>{
      if(res){
        this.conversation = res.data;
        this.dataStudent = res.data;
      }else{
        this.conversation = [];
        this.dataStudent = [];
      }
      this.router.navigate(["ei/messages-details"],{queryParams:{"chat":chatConversion}});
    })
    
    
    
  }
  getGroupDetails(uuid){
    this.groupList=[];
    this.firestore.collection('group').snapshotChanges().subscribe((res:any)=>{
      res.forEach(element => {
         
        this.firestore.collection('group').doc(element.payload.doc.id).valueChanges().subscribe((res:any)=>{
          console.log(res);
          res.uuid=element.payload.doc.id;
          if(!res.group_icon){
            res.group_icon="assets/images/userWebsite/users.png";
          }
            res.reciepent.forEach(ele => {
              if(ele[uuid] && (ele[uuid].is_remove==0 &&  ele[uuid].is_exit==0)){
                var index=this.groupList.find((e)=>{return e.group_title==res.group_title})
                if(!index){
                  this.groupList.push(res)
                  this.lastGroupmsg[element.payload.doc.id]=[]
                  this.firestore.collection('chat_conversation').doc(element.payload.doc.id).valueChanges().subscribe((res1: any) => {
                    //console.log(res1.data[res1.data.length-1]);
                    if(!this.lastGroupmsg[element.payload.doc.id].find(el=>{return el.timestamp==res1.data[res1.data.length-1].timestamp}))
                    this.lastGroupmsg[element.payload.doc.id].push(res1.data[res1.data.length-1])
                    //console.log(this.lastGroupmsg);
                    
                  })
                }
              }else{
                this.groupexit=1; 
              }
              
            });
            
          
          
        })
      });
      
    })
    
    
  }
  getRecepintUserDetails(uuid) {
    localStorage.setItem("receipent",uuid);
      this.firestore.collection('users').doc(uuid).ref.get().then(res => {
      this.recepintDetails = res.data();
      });
      
  }
  messageDetails(uid,chatConversion){
    localStorage.setItem('guuid', uid);
    this.router.navigate(["ei/messages-details"],{queryParams:{"chat":chatConversion}});
  }

}
