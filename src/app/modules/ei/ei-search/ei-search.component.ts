import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-ei-search',
  templateUrl: './ei-search.component.html',
  styleUrls: ['./ei-search.component.css']
})
export class EiSearchComponent implements OnInit {
  searchText: any;
  dataSource: any;
  filterBy: any = 'user';

  currentCitySearchConfig: any = {
    "api_endpoint": "user/city-list/",
    "displayImage": false,
    "placeholder": "Current City",
    "seeMoreResults": false
  }

  currentSchoolSearchConfig: any = {
    "api_endpoint": "user/all-school-list-of-user/",
    "displayImage": true,
    "placeholder": "Current School",
    "display": ["name_of_school"],
    "seeMoreResults": false
  }

  pastSchoolSearchConfig: any = {
    "api_endpoint": "user/all-school-list-of-user/",
    "displayImage": true,
    "placeholder": "Past School",
    "display": ["name_of_school"],
    "seeMoreResults": false
  }

  schoolSearchId: any;
  cityId: any = '';
  currentSchoolName = '';
  pastSchoolName = '';
  currentUser: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.searchText = this.route.snapshot.queryParamMap.get('searchText');
    this.currentUser = localStorage.getItem('userId')
    if (this.searchText)
      this.getSearchData()
  }


  getSearchData() {
    let params = {
      "search": this.searchText,
      "filter_by": this.filterBy,
      "school_id": this.schoolSearchId,
      "city_id": this.cityId
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

  getfilteredData(data: TabDirective): void {
    if (data.heading == 'Student')
      this.filterBy = 'student';
    else
      this.filterBy = 'alumni';
    this.cityId = '';
    this.getSearchData()
  }

  getCurrentSchoolSearchResult(data: any) {
    this.filterBy = "current";
    this.schoolSearchId = data.id;
    this.cityId = '';
    this.pastSchoolName = ''
    this.getSearchData()
  }

  getPastSchoolSearchResult(data: any) {
    this.filterBy = "past";
    this.schoolSearchId = data.id;
    this.cityId = '';
    this.currentSchoolName = '';
    this.getSearchData()
  }

  getCurrentCitySearchResult(data: any, filterBy: any) {
    this.filterBy = filterBy;
    this.schoolSearchId = '';
    this.cityId = data.id
    this.getSearchData();
  }

  userProfile(id: any) {
    this.router.navigate(['ei/student-profile'], { queryParams: { 'stId': id } });
  }

  getUserSearchData() {
    this.filterBy = 'user';
    this.schoolSearchId = '';
    this.getSearchData();
  }

}
