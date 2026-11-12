import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ApolloError, gql } from '@apollo/client/core';
import { Employee } from '../model/employee';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $name: String!
    $dateOfBirth: String!
    $city: String!
    $salary: Float!
    $gender: String
    $email: String
  ) {
    newEmployee(
      createEmployeeInput: {
        name: $name
        dateOfBirth: $dateOfBirth
        city: $city
        salary: $salary
        gender: $gender
        email: $email
      }
    ) {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees$ = new BehaviorSubject<readonly Employee[]>([]);
  loading = false;
  loadError = '';

  constructor(private apollo: Apollo) {
    this.loadEmployees();
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$.asObservable();
  }

  loadEmployees(): void {
    if (this.loading) return;

    this.loading = true;
    this.loadError = '';

    this.apollo.query<{ employees: Employee[] }>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only',
      errorPolicy: 'none'
    }).subscribe({
      next: ({ data }) => {
        this.employees$.next(data.employees);
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loadError = this.getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.apollo.mutate<{ newEmployee: Employee }>({
      mutation: ADD_EMPLOYEE,
      errorPolicy: 'none',
      variables: {
        name: employee.name,
        dateOfBirth: employee.dateOfBirth,
        city: employee.city,
        salary: employee.salary,
        gender: employee.gender,
        email: employee.email
      }
    }).pipe(
      map(({ data }) => {
        if (!data?.newEmployee) {
          throw new Error('No employee returned.');
        }

        this.employees$.next([
          ...this.employees$.getValue(),
          data.newEmployee
        ]);

        return data.newEmployee;
      })
    );
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof ApolloError) {
      const messages = error.graphQLErrors
        .filter(item =>
          item.extensions?.['classification'] === 'BAD_REQUEST'
        )
        .map(item => item.message);

      if (messages.length) {
        return [...new Set(messages)].join(' ');
      }

      if (error.networkError) {
        return 'Cannot reach the server. Make sure it is running, then try again.';
      }
    }

    return 'Something went wrong. Please try again. If it continues, check that the server and MongoDB are running.';
  }
}