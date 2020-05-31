import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { AboutComponent } from './components/dashboard/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from './components/dashboard/home/chart/chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartTargetValuesComponent } from './components/dashboard/home/chart-target-values/chart-target-values.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SwitchNetworkModalComponent } from './components/switch-network-modal/switch-network-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminComponent,
    HomeComponent,
    AboutComponent,
    ChartComponent,
    ChartTargetValuesComponent,
    SwitchNetworkModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatDividerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SwitchNetworkModalComponent]
})
export class AppModule { }
