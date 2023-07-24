import { CalendarProjectComponent } from './e-commerce/project-calendar/project-calendar.coponent';
import { EditProjectComponent } from './e-commerce/project-edit/project-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { MainProjectComponent } from './layout/main-project/main-project.component';
import { ProjectListComponent } from './layout/project-list/project-list.component';
import { ViewMainProjectComponent } from './layout/view-main-project/view-main-project.component';

import { FolderViewComponent } from './layout/folder-view/folder-view.component';
import { ProjectFileComponent } from './e-commerce/project-files/project-file.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'document',
      component: DashboardComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'main-project',
      component: MainProjectComponent,
      },
      {
        path :'project-list',
        component:ProjectListComponent
      },
      
       {
        path :'folder-view',
        component:FolderViewComponent
      },
    {
      path :'edit-project/:id',
      component:EditProjectComponent
    },
    {
      path :'project-files/:id',
      component:ProjectFileComponent
    },
    {
      path :'view-main-project/:id',
      component:ViewMainProjectComponent
    },
    {
      path :'calender-project',
      component:CalendarProjectComponent
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
