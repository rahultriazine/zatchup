import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { TicketsList } from '../Modals/tickets-list.modal';

@Component({
  selector: 'app-tickets-onboarding',
  templateUrl: './tickets-onboarding.component.html',
  styleUrls: ['./tickets-onboarding.component.css']
})
export class TicketsOnboardingComponent implements OnInit {

  ticketsList: TicketsList
  constructor(
    private alert: NotificationService,
    private loader: NgxSpinnerService,
    private baseService: BaseService,
    private datePipe: DatePipe,
    private location: Location
  ) { 
    this.ticketsList = new TicketsList();
    this.ticketsList.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getAllState();
    this.getTicketsList('');
  }

  getTicketsList(page?: any) {
    this.loader.show();
    let stateFind: any;
    let cityFind: any;
    if (this.ticketsList.allStates && this.ticketsList.stateId) {
      cityFind = this.ticketsList.allCities.find(val => {
        return val.id == this.ticketsList.cityId
      })
    }
    if (this.ticketsList.allCities) {
      stateFind = this.ticketsList.allStates.find(val => {
        return val.id == this.ticketsList.stateId
      })
    }
    this.ticketsList.listParams = {
      'date_from': this.ticketsList.filterFromDate !== undefined ? this.datePipe.transform(this.ticketsList.filterFromDate, 'yyyy-MM-dd') : '',
      'date_to': this.ticketsList.filterToDate !== undefined ? this.datePipe.transform(this.ticketsList.filterToDate, 'yyyy-MM-dd') : '',
      "city": cityFind ? cityFind.city : '',
      "state": stateFind ? stateFind.state : '',
      "university": this.ticketsList.university,
      "page_size": this.ticketsList.pageSize,
      "page": page
    }
    this.baseService.getData('admin/contact_query_admin_list/', this.ticketsList.listParams).subscribe(
      (res: any) => {
        if (res.status == true) {
          if (!page)
            page = this.ticketsList.config.currentPage
          this.ticketsList.startIndex = res.page_size * (page - 1) + 1;
          this.ticketsList.config.itemsPerPage = res.page_size;
          this.ticketsList.pageSize = res.page_size;
          this.ticketsList.config.currentPage = page
          this.ticketsList.config.totalItems = res.count;
          if (res.count > 0)
            this.ticketsList.dataSource = res.results
          else
            this.ticketsList.dataSource = undefined
        }
        else
          this.alert.error(res.error.message[0], 'Error')
        this.loader.hide();
      }
    ), (err: any) => {
      this.alert.error(err, 'Error')
      this.loader.hide();
    }
  }

  generateExcel() {
    delete this.ticketsList.listParams.page_size;
    delete this.ticketsList.listParams.page;
    this.ticketsList.listParams['export_csv'] = true
    this.baseService.generateExcel('admin/export_contact_query_admin_list/', 'ticket-list', this.ticketsList.listParams);
  }


  getAllState() {
    this.baseService.getData('user/getallstate/').subscribe(
      (res: any) => {
        console.log('get state res ::', res)
        if (res.count > 0)
          this.ticketsList.allStates = res.results
      }
    )
  }

  getCities() {
    this.baseService.getData('user/getcitybystateid/' + this.ticketsList.stateId).subscribe(
      (res: any) => {
        if (res.count > 0)
          this.ticketsList.allCities = res.results
        console.log('get state res ::', res)
      }
    )
  }

  goBack(): void {
    // let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl")
    // this.router.navigate([returnUrl]);
    this.location.back();
    console.log(location)
  }

}