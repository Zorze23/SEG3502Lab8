import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeesComponent } from './employees/employees.component';

export const routes: Routes = [
  { path: 'employee', component: EmployeeComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: '**', redirectTo: 'employees' }
];