
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EmployeeContext = createContext(null);

const initialEmployees = [
  {
    id: "EMP001",
    name: "Test Employee",
    email: "testemployee@example.com",
    phone: "9876543210",
    department: "IT",
    designation: "Software Developer",
    status: "Active",
    photo: "",
  },
  {
    id: "EMP002",
    name: "Test2 Employee",
    email: "test2employee@example.com",
    phone: "9876543211",
    department: "HR",
    designation: "HR Executive",
    status: "Active",
    photo: "",
  },
];

function getSavedEmployees() {
  try {
    const saved = localStorage.getItem("payrollhub_employees");

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved employees:", error);
  }

  return initialEmployees;
}

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(getSavedEmployees);

  useEffect(() => {
    try {
      localStorage.setItem(
        "payrollhub_employees",
        JSON.stringify(employees)
      );
    } catch (error) {
      console.error("Could not save employees:", error);
    }
  }, [employees]);

  return (
    <EmployeeContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      "useEmployees must be used inside EmployeeProvider"
    );
  }

  return context;
}
