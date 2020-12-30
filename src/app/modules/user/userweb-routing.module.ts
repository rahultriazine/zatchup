import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserKycVerificationComponent } from './user-kyc-verification/user-kyc-verification.component';
import { UserQualificationComponent } from './user-qualification/user-qualification.component';
import { UserWorkDetailComponent } from './user-work-detail/user-work-detail.component';
import { UserSchoolConfirmationComponent } from './user-school-confirmation/user-school-confirmation.component';
import { UserKycSuccessfulDoneComponent } from './user-kyc-successful-done/user-kyc-successful-done.component';
import { UserCongratulationComponent } from './user-congratulation/user-congratulation.component';
import { UserAddCourseComponent } from './user-add-course/user-add-course.component';
import { UserAddEiComponent } from './user-add-ei/user-add-ei.component';
import { UserEiConfirmationComponent } from './user-ei-confirmation/user-ei-confirmation.component';
import { UserEiProfileComponent } from './user-ei-profile/user-ei-profile.component';
import { UserEiProfileNotOnboardComponent } from './user-ei-profile-not-onboard/user-ei-profile-not-onboard.component';
import { UserAddMoreEiComponent } from './user-add-more-ei/user-add-more-ei.component';
import { UserAddMoreStandardComponent } from './user-add-more-standard/user-add-more-standard.component';
import { UserProfileCreatedSuccessfullyComponent } from './user-profile-created-successfully/user-profile-created-successfully.component';
import { UserLandingPageComponent } from './user-landing-page/user-landing-page.component';
import { UserPaymentComponent } from './user-payment/user-payment.component';
import { UserMySchoolTabComponent } from './user-my-school-tab/user-my-school-tab.component';
import { UserCertificateComponent } from './user-certificate/user-certificate.component';
import { UserZatchupStarClassComponent } from './user-zatchup-star-class/user-zatchup-star-class.component';
import { UserProjectFundingComponent } from './user-project-funding/user-project-funding.component';
import { UserFundingDetailsComponent } from './user-funding-details/user-funding-details.component';
import { UserLectureRequestComponent } from './user-lecture-request/user-lecture-request.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { UserRemaindersComponent } from './user-remainders/user-remainders.component';
import { UserMyEducationalProfileComponent } from './user-my-educational-profile/user-my-educational-profile.component';
import { UserMyBuddiesComponent } from './user-my-buddies/user-my-buddies.component';
import { UserCreatePostComponent } from './user-create-post/user-create-post.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserSchoolProfileComponent } from './user-school-profile/user-school-profile.component';
import { UserMyProfileComponent } from './user-my-profile/user-my-profile.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { AddNewCourseComponent } from './add-new-course/add-new-course.component';
import { AboutUsComponent } from './user-info/about-us/about-us.component';
import { CareerComponent } from './user-info/career/career.component';
import { ContactUsComponent } from './user-info/contact-us/contact-us.component'
import { AddMoreCourseManuallyComponent } from './add-more-course-manually/add-more-course-manually.component'
import { AddPastEiComponent } from './add-past-ei/add-past-ei.component';
import { UserPageNotFoundComponent } from './user-page-not-found/user-page-not-found.component';
import { MySchoolComponent } from './my-school/my-school.component';
import { ChatComponent } from './chat/chat.component';
import { StartNewChatComponent } from './start-new-chat/start-new-chat.component';
import { CreateGroupChatComponent } from './create-group-chat/create-group-chat.component';
import { CreateGroupComponent } from './create-group/create-group.component';
const routes: Routes = [
  {
    path: '', component: UserSignUpComponent
  }, 
  {
    path: 'user', component: UserSignUpComponent
  }, 
  {
    path: 'user/login', component: UserLoginComponent
  }, 
  {
    path: 'user/signup', component: UserSignUpComponent
  }, 
  {
    path: 'user/forgot-password', component: UserForgotPasswordComponent
  }, 
  {
    path: 'user/reset-password', component: UserResetPasswordComponent
  }, 
  {
    path: 'user/kyc-verification', component: UserKycVerificationComponent
  }, 
  {
    path: 'user/Kyc-successful-done', component: UserKycSuccessfulDoneComponent
  },
  {
    path: 'user/qualification', component: UserQualificationComponent
  }, 
  {
    path: 'user/work-detail', component: UserWorkDetailComponent
  }, 
  {
    path: 'user/school-confirmation', component: UserSchoolConfirmationComponent
  }, 
  {
    path: 'user/congratulation', component: UserCongratulationComponent
  }, 
  {
    path: 'user/add-ei', component: UserAddEiComponent
  }, 
  {
    path: 'user/ei-profile', component: UserEiProfileComponent
  },
  {
    path: 'user/add-new-course', component: AddNewCourseComponent
  },
  
  {
    path: 'user/add-course', component: UserAddCourseComponent
  }, 
  {
    path: 'user/add-more-standard', component: UserAddMoreStandardComponent
  }, 
  {
    path: 'user/add-more-ei', component: UserAddMoreEiComponent
  }, 
  {
    path: 'user/ei-confirmation', component: UserEiConfirmationComponent
  }, 
  {
    path: 'user/profile-created', component: UserProfileCreatedSuccessfullyComponent
  },
  {
    path: 'user/landing-page', component: UserLandingPageComponent
  },
  {
    path: 'user/payment-page', component: UserPaymentComponent
  },
  {
    path: 'user/my-school-tab', component: UserMySchoolTabComponent
  },
  {
    path: 'user/certificate', component: UserCertificateComponent
  },
  {
    path: 'user/zatchup-star-class', component: UserZatchupStarClassComponent
  },
  {
    path: 'user/project-funding', component: UserProjectFundingComponent
  },
  {
    path: 'user/funding-details', component: UserFundingDetailsComponent
  },
  {
    path: 'user/lecture-request', component: UserLectureRequestComponent
  },
  {
    path: 'user/profile', component: UserProfileComponent
  },
  {
    path: 'user/notifications', component: UserNotificationsComponent
  },
  {
    path: 'user/remainders', component: UserRemaindersComponent
  },
  {
    path: 'user/search', component: UserSearchComponent
  },
  {
    path: 'user/my-educational-profile', component: UserMyEducationalProfileComponent
  },
  {
    path: 'user/my-buddies', component: UserMyBuddiesComponent
  },
  {
    path: 'user/create-post', component: UserCreatePostComponent
  },
  {
    path: 'user/school-profile', component: UserSchoolProfileComponent
  },
  {
    path: 'user/my-profile', component: UserMyProfileComponent
  },
  {
    path: 'user/career', component: CareerComponent
  },
  {
    path: 'user/about-us', component: AboutUsComponent
  },
  {
    path: 'user/contact-us', component: ContactUsComponent
  }
  ,
  {
    path: 'user/add-more-course', component: AddMoreCourseManuallyComponent
  },
  {
    path: 'user/add-past-ei', component: AddPastEiComponent
  },

  {
    path: 'user/my-school', component: MySchoolComponent
  },

  {
    path: 'user/chat', component: ChatComponent
  },

  {
    path: 'user/new-chat', component: StartNewChatComponent
  },

  {
    path: 'user/group-chat', component: CreateGroupChatComponent
  },
  
  {
    path: 'user/create-group', component: CreateGroupComponent
  },
  









  {
    path: '**', component: UserPageNotFoundComponent
},

  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserwebRoutingModule { }
