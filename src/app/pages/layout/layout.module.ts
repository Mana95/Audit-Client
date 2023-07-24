// import { FormsModule } from './../forms/forms.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbStepperModule,
  NbTabsetModule, NbTooltipModule, NbTreeGridModule, NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { Tab1Component, Tab2Component, TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ListComponent } from './list/list.component';
import { InfiniteListComponent } from './infinite-list/infinite-list.component';
import { NewsPostComponent } from './infinite-list/news-post/news-post.component';
import { NewsPostPlaceholderComponent } from './infinite-list/news-post-placeholder/news-post-placeholder.component';
import { AccordionComponent } from './accordion/accordion.component';
import { NewsService } from './news.service';
// import { FolderCreationComponent } from './folder-creation/folder-creation.component';
import { MainProjectComponent } from './main-project/main-project.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ViewMainProjectComponent } from './view-main-project/view-main-project.component';
import { FolderViewComponent } from './folder-view/folder-view.component';
import { UserLoginComponent } from './authentication/login/login-user.component';
import { RegisterComponent } from './authentication/registration/register.component';
import { RequestPasswordComponent } from './authentication/request-password/request-password.component';
import { resonsepasswordComponent } from './authentication/response-reset-password/response-reset-password.component';

@NgModule({
  imports: [
    // FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbAccordionModule,
    NbUserModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    NbTreeGridModule,
    NbIconModule,
    NbAlertModule,
    NbInputModule,
    NbSelectModule,
    NbListModule,
    FormsModule,
    NbTooltipModule
  ],
  declarations: [
    LayoutComponent,
    TabsComponent,
    Tab1Component,
    Tab2Component,
    StepperComponent,
    ListComponent,
    NewsPostPlaceholderComponent,
    InfiniteListComponent,
    NewsPostComponent,
    // FolderCreationComponent,
    AccordionComponent,
    MainProjectComponent,
    ProjectListComponent,
    ViewMainProjectComponent,
    FolderViewComponent,
    UserLoginComponent,
    RegisterComponent,RequestPasswordComponent,resonsepasswordComponent
  ],
  providers: [
    NewsService,
  ],
})
export class LayoutModule { }
