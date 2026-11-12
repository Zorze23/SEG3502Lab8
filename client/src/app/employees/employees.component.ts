import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, CurrencyPipe],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  constructor(protected employees: EmployeeService) {}
}