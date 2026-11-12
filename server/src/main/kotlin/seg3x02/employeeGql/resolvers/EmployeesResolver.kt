package seg3x02.employeeGql.resolvers

import graphql.GraphQLError
import graphql.GraphqlErrorBuilder
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.execution.ErrorType
import org.springframework.stereotype.Controller
import seg3x02.employeeGql.entity.Employee
import seg3x02.employeeGql.repository.EmployeesRepository
import seg3x02.employeeGql.resolvers.types.CreateEmployeeInput
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.UUID

@Controller
class EmployeesResolver(
    private val employeesRepository: EmployeesRepository
) {
    @QueryMapping
    fun employees(): List<Employee> = employeesRepository.findAll()

    @MutationMapping
    fun newEmployee(
        @Argument("createEmployeeInput") input: CreateEmployeeInput
    ): Employee {
        val name = input.name?.trim().orEmpty()
        val city = input.city?.trim().orEmpty()
        val dateOfBirth = input.dateOfBirth?.trim().orEmpty()
        val salary = requireNotNull(input.salary) {
            "Salary is required."
        }

        require(name.isNotBlank()) {
            "Name cannot be blank."
        }

        require(city.isNotBlank()) {
            "City cannot be blank."
        }

        require(salary.isFinite() && salary >= 0) {
            "Salary must be a finite, non-negative number."
        }

        val birthDate = try {
            LocalDate.parse(dateOfBirth)
        } catch (exception: DateTimeParseException) {
            throw IllegalArgumentException(
                "Date of birth must be a valid date in YYYY-MM-DD format."
            )
        }

        require(!birthDate.isAfter(LocalDate.now())) {
            "Date of birth cannot be in the future."
        }

        val employee = Employee(
            name = name,
            dateOfBirth = birthDate.toString(),
            city = city,
            salary = salary,
            gender = input.gender?.trim()?.takeIf { it.isNotEmpty() },
            email = input.email?.trim()?.takeIf { it.isNotEmpty() }
        )

        employee.id = UUID.randomUUID().toString()
        return employeesRepository.save(employee)
    }

    @GraphQlExceptionHandler
    fun handleInvalidInput(exception: IllegalArgumentException): GraphQLError {
        return GraphqlErrorBuilder.newError()
            .errorType(ErrorType.BAD_REQUEST)
            .message(exception.message ?: "Invalid employee information.")
            .build()
    }
}