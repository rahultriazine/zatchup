import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PlayHistory } from '../common/starclass-model';

@Component({
  selector: 'app-play-history',
  templateUrl: './play-history.component.html',
  styleUrls: ['./play-history.component.css']
})
export class PlayHistoryComponent implements OnInit {
  playHistory : PlayHistory
  constructor(
    private baseService : BaseService,
    private loader : NgxSpinnerService,
    private alert : NotificationService,
    private location : Location
  ) { 
    this.playHistory = new PlayHistory()
  }

  ngOnInit(): void {
    this.getPlayHistory()
  }

  getPlayHistory(page? : any) {
    try {
      this.loader.show()
      this.playHistory.model = {
        'page': page,
        'page_size': this.playHistory.page_size
      }
      this.baseService.getData('', this.playHistory.model).subscribe(
        (res: any) => {
          if(res.status == true){
            page = this.playHistory.config.currentPage
            this.playHistory.startIndex = res.page_size * (page - 1) + 1;
            this.playHistory.page_size = res.page_size 
            this.playHistory.config.itemsPerPage = this.playHistory.page_size
            this.playHistory.config.currentPage = page
            this.playHistory.config.totalItems = res.count
            if(res.count > 0) {
             this.playHistory.dataSource = res.results;
             this.playHistory.pageCounts = this.baseService.getCountsOfPage()
            }
            else{
              this.playHistory.dataSource = undefined;
              this.playHistory.pageCounts = undefined
            }
          }
          else {
            this.alert.error(res.error.message, 'Error')
          }
          this.loader.hide()
        }, err => {
          this.alert.error("Please Try Again", 'Error')
          this.loader.hide()
        }
      )
    } catch (error) {
     this.alert.error(error.error, 'Error') 
     this.loader.hide()
    }
  }

  goBack(){
    this.location.back()
  }

}
