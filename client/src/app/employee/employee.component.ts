import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  saving = false;
  saveError = '';

  employeeForm = this.builder.nonNullable.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, Validators.required],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email]
  });

  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  get name() {
    return this.employeeForm.controls.name;
  }

  get dateOfBirth() {
    return this.employeeForm.controls.dateOfBirth;
  }

  get city() {
    return this.employeeForm.controls.city;
  }

  get salary() {
    return this.employeeForm.controls.salary;
  }

  get email() {
    return this.employeeForm.controls.email;
  }

  onSubmit(): void {
    if (this.saving) return;

    this.saveError = '';

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const values = this.employeeForm.getRawValue();

    const employee = new Employee(
      '',
      values.name,
      values.dateOfBirth,
      values.city,
      values.salary,
      values.gender,
      values.email
    );

    this.saving = true;

    this.employeeService.addEmployee(employee).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/employees']);
      },
      error: (error: unknown) => {
        this.saving = false;
        this.saveError = this.employeeService.getErrorMessage(error);
      }
    });
  }
}