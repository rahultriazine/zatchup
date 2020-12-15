import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent implements OnInit {
  menus: any;
  moduleList: any;
  user_type: any
  userData: any
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  small = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private baseService: BaseService,
    private alert: NotificationService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.small = true;
          console.log(
            'Matches small viewport or handset in portrait mode'
          );
        } else {
          this.small = false;
        }
      });

  }

  ngOnInit() {
    if (sessionStorage.getItem('permissions'))
      this.moduleList = JSON.parse(sessionStorage.getItem('permissions'))
    if (localStorage.getItem('user_type'))
      this.user_type = localStorage.getItem('user_type')
    this.getUserInfo();

  }

  goToAdminDashboardPage() {
    this.router.navigate(['admin/dashboard']);
  }

  goToAdminSchoolManagementPage() {
    this.router.navigate(['admin/school-management']);
  }

  goToAdminUserPage() {
    this.router.navigate(['admin/user']);
  }

  goToAdminZatchCertificateResultPage() {
    this.router.navigate(['admin/zatchup-certificate-result']);
  }

  kycApprovalMgmt() {
    this.router.navigate(['admin/kyc-approval-management'])
  }

  paymentMgmt() {
    this.router.navigate(['admin/payment-management'])
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['admin/login']);
  }

  subadminRoute() {
    this.router.navigate(['admin/subadmin-dashboard']);
  }

  isValid(parent_module_code) {
    if (this.moduleList && this.user_type == 'ZATCHUPSUBADMIN') {
      let val = this.moduleList.find(el => {
        return el.parent_module_code == parent_module_code
      })
      if (val) {
        return true
      }
      else
        return false
    }
    return true
  }

  getUserInfo() {
    this.baseService.getData('ei/auth-user-info/').subscribe(
      (res: any) => {
        if (res.status == true)
          this.userData = res
      }
    )
  }
}
