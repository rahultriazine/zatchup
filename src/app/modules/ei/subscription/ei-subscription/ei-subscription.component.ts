
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

declare var Razorpay: any

@Component({
  selector: 'app-ei-subscription',
  templateUrl: './ei-subscription.component.html',
  styleUrls: ['./ei-subscription.component.css']
})
export class EiSubscriptionComponent implements OnInit {
  @ViewChild('closePaymentModel') closePaymentModel: any;
  subscriptionList: any;
  subscription: any;
  couponCode: any;
  applyCouponData: any;
  paymentHtml: any;
  public env: any = environment;
  subscriptionDetails: any = {};
  is_activate_subscription: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private baseService: BaseService,
    private loader: NgxSpinnerService,
    private alert: NotificationService,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  ngOnInit(): void {
    this.getSubscriptionDetail()
    this.getSubList();
    // debugger
  }

  renewSubscription() {
    this.router.navigate(['ei/add-subscription']);
  }
  updateSubscription() { }

  getSubscriptionDetail() {
    this.loader.show();
    this.baseService.getData('ei/get-subscription-detail/').subscribe(
      (res: any) => {
        if (res.status == true)
          this.subscriptionDetails = res.data;
        this.is_activate_subscription = this.subscriptionDetails.is_activate_subscription
        this.loader.hide();
      }
    ), err => {
      this.loader.hide();
      this.alert.error(err.error, 'Error')
    }
  }

  makePayment() {
    this.paymentHtml = '';
    this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Price:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; <del>' + this.subscription.current_amount + '</del></div></div>';
    this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Discount:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; ' + 0 + '</div></div>';
    this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Net Price: </div> <div class="col-md-5 pr-0 text-left color-purple">&#8377;' + this.subscription.current_amount + '</div></div>';
  }

  getSubList() {
    this.loader.show();
    this.baseService.getData('ei/subscriptions-list/').subscribe(
      (res: any) => {
        if (res.count > 0)
          this.subscriptionList = res.results
        this.loader.hide();
      }
    ), err => {
      this.loader.hide();
      this.alert.error(err.error, 'Error')
    }
  }

  getAmount(subscription: any) {
    this.subscription = subscription
  }

  requestForTheRazorPayment(code, buttonClick) {
    //Display Loader Before Request of the service  
    this.loader.show();
    let data = {
      "coupon_code": code,
      "coupon_type": "subscription_fees",
      "subscription_id": this.subscription.id
    }
    this.baseService.action('ei/payment-process/', data).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.status === true)// Condition True Success 
        {
          this.paymentHtml = '';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Price:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; <del>' + res.original_price + '</del></div></div>';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Discount:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; ' + res.discount_amount + '</div></div>';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Net Price: </div> <div class="col-md-5 pr-0 text-left color-purple">&#8377;' + res.price + '</div></div>';

          if (buttonClick) {
            var that = this;
            var options = {
              "key": this.env.razorApiKey,
              "currency": "INR",
              "amount": parseInt(res.price) * 100,
              "description": "",
              "order_id": res.order_id,
              "prefill": {
                "name": res.name,
                "email": res.email
              },
              "handler": function (res) {
                if (res.razorpay_payment_id) {
                  that.closePaymentModel.nativeElement.click()
                  // that.getSubscriptionDetail();
                  // document
                  // that.getSubList();
                  // that.is_activate_subscription = true
                  // window.location.href = '#/ei/subscription';
                  that._document.location.reload()
                }
              },
              "notes": {
                "address": ""
              }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
          }

        } else {
          this.alert.error(res.error.message[0], "Error")
        }
        this.loader.hide();
      }, (error) => {
        this.loader.hide();
      });
  }

  applyCoupon() {
    this.loader.show();
    let data = {
      "subscription_id": this.subscription.id,
      "coupon_code": this.couponCode,
      "coupon_type": "subscription_fees"
    }
    this.baseService.action('ei/get-subscription-data-after-coupon/', data).subscribe(
      (res: any) => {
        console.log('apply coupon res ::', res)
        if (res.status)
        // this.applyCouponData = res.data
        {
          this.paymentHtml = '';
          this.paymentHtml += '<div class="row"><div class="col-md-4 pr-0"></div><div class="col-md-8 pr-0 text-left color-green">' + 'Coupon Applied' + '</div></div>';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Price:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; <del>' + res.data.current_amount + '</del></div></div>';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Discount:</div> <div class="col-md-5 pr-0 text-left color-purple">&#8377; ' + res.data.discount_amount + '</div></div>';
          this.paymentHtml += '<div class="row"><div class="col-md-7 pr-0">Net Price: </div> <div class="col-md-5 pr-0 text-left color-purple">&#8377;' + res.data.price + '</div></div>';
        }
        else
          this.alert.error(res.error.message, 'Error')
        this.loader.hide();
      }
    ), err => {
      this.loader.hide();
      this.alert.error(err.error, 'Error')
    }
  }

  goBack(): void {
    this.location.back()
  }
}
