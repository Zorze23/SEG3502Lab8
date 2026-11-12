package seg3x02.employeeGql.resolvers

import org.springframework.stereotype.Controller
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import seg3x02.employeeGql.entity.Employee
import seg3x02.employeeGql.repository.EmployeesRepository
import seg3x02.employeeGql.resolvers.types.CreateEmployeeInput
import java.util.UUID

@Controller
class EmployeesResolver(private val employeesRepository: EmployeesRepository) {
    @QueryMapping
    fun employees(): List<Employee> = employeesRepository.findAll()

    @MutationMapping
    fun newEmployee(@Argument("createEmployeeInput") input: CreateEmployeeInput): Employee {
        val employee = Employee(
            name = requireNotNull(input.name),
            dateOfBirth = requireNotNull(input.dateOfBirth),
            city = requireNotNull(input.city),
            salary = requireNotNull(input.salary),
            gender = input.gender,
            email = input.email
        )
        employee.id = UUID.randomUUID().toString()
        return employeesRepository.save(employee)
    }
}
