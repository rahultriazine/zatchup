import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  searchText: any;
  dataSource: any;
  filterBy: any = 'user'
  currentSchoolSearchConfig: any = {
    "api_endpoint": "user/all-school-list-of-user/",
    "displayImage": true,
    "placeholder": "Current School",
    "display": ["name_of_school"]
  }

  pastSchoolSearchConfig: any = {
    "api_endpoint": "user/all-school-list-of-user/",
    "displayImage": true,
    "placeholder": "Past School",
    "display": ["name_of_school"]
  }
  schoolSearchId: any;
  allStates: any;
  stateId: any = '';
  cityId: any = '';
  allCities: any;
  peopleStateId: any = '';
  peopleCityId: any = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.searchText = this.route.snapshot.queryParamMap.get('searchText');
    if (this.searchText)
      this.getSearchData()
    this.getAllState()
  }

  getSearchData() {
    let params = {
      "search": this.searchText,
      "filter_by": this.filterBy,
      "school_id": this.schoolSearchId
    }
    this.baseService.getData('user/search-list-for-school-student', params).subscribe(
      (res: any) => {
        if (res.status == true) {
          if (res.count == 0)
            this.dataSource = undefined
          else
            this.dataSource = res.results;
        }
        else {

        }
      }
    )
  }

  goToMyBuddiesPage() {
    this.router.navigate(['user/my-buddies']);
  }

  getfilteredData(data: TabDirective): void {
    if (data.heading == 'People')
      this.filterBy = 'user';
    else
      this.filterBy = 'school';
    this.getSearchData()
  }

  getCurrentSchoolSearchResult(data: any) {
    this.filterBy = "current";
    this.schoolSearchId = data.id
    this.getSearchData()
  }

  getPastSchoolSearchResult(data: any) {
    this.filterBy = "past";
    this.schoolSearchId = data.id
    this.getSearchData()
  }

  getAllState() {
    this.baseService.getData('user/getallstate/').subscribe(
      (res: any) => {
        if (res.count > 0)
          this.allStates = res.results
      }
    )
  }

  getCities() {
    this.baseService.getData('user/getcitybystateid/' + this.stateId).subscribe(
      (res: any) => {
        if (res.count > 0)
          this.allCities = res.results
      }
    )
  }
}
