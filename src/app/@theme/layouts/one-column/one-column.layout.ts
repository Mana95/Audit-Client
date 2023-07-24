import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ECommerceService } from 'app/pages/e-commerce/services/e-commerce.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
       <hr/>
  <nb-card-body class="example-last-child-no-b-margin" *ngIf="calanderData">
    <!-- <p (click)="close()">X</p> -->
    <p><b>{{calanderData?.title}}</b></p>
    <nb-alert  closable  (close)="close()" status="info"><p style="color:black;text-align:center;"><b>Nume Proiect</b> <br/></p> {{calanderData?.projectName}}
    <button nbButton shape="round"  size="small" (click)="navigatePage()"  status="primary"  >More Info...</button>
    </nb-alert>
    
  </nb-card-body>

      </nb-sidebar>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {
  calanderData :any;  
  private destroy$ = new Subject();

  constructor(private eCommerceService: ECommerceService,
    private router: Router,) { }

  ngOnInit() {
    this.subscribeToCalanderData();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  
  close() {
    this.calanderData = null;
  }
 navigatePage() {
  this.router.navigate(['/pages/edit-project',this.calanderData.id]);
  }
  private subscribeToCalanderData() {
    this.eCommerceService.getCalanderItemData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.calanderData = data;
        setTimeout(() => {
          this.calanderData =null;
        }, 8000);
      });
  }
}
