import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

import { BASE_URL } from "../utils/constant";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const loadFingerprintJS = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };

    loadFingerprintJS();
  }, []);

  useEffect(() => {
    if (deviceId) {
      fetchEmployees(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, deviceId]);

  const fetchEmployees = async (page, limit) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/agentlist/?page=${page}&limit=${limit}`,
        {
          headers: {
            deviceid: deviceId,
            authorization: `Token ${user.token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log(response.data);
      setEmployees(response.data.Agents);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("There was an error fetching the data!");
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://192.168.104.208:3000/admin/${id}`, {
        headers: {
          deviceid: deviceId,
          authorization: `Token ${user.token}`,
        },
      })
      .then(() => {
        toast.success("Employee deleted successfully !");
        fetchEmployees(page + 1, rowsPerPage);
      })
      .catch((error) => {
        toast.error("There was an error deleting the employee!", error);
      });
  };

  const handleUpdate = (employee) => {
    setCurrentEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEmployee(null);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://192.168.104.208:3000/admin/${currentEmployee._id}`,
        currentEmployee,
        {
          headers: {
            deviceid: deviceId,
            authorization: `Token ${user.token}`,
          },
        }
      )
      .then(() => {
        toast.success("Employee data updated sucessfully");
        fetchEmployees(page + 1, rowsPerPage);
        handleClose();
      })
      .catch((error) => {
        toast.error("There was an error updating the employee!", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box marginTop={8} padding={"3px"}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ fontWeight: 700, fontStyle: "bold" }}>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                  }}
                >
                  Employee ID
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                  }}
                >
                  First Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                  }}
                >
                  Last Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: 700,
                    fontStyle: "bold",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees ? (
                employees.map((employee) => (
                  <motion.tr
                    key={employee._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TableCell>{employee.username}</TableCell>
                    <TableCell>{employee.employeeID}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        gap: "5px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(employee)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(employee._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <pre>No Employee found</pre>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalPages * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update this employee, please edit the fields below.
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleUpdateSubmit}
              sx={{ mt: 3 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="fname"
                value={currentEmployee?.firstName || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={currentEmployee?.lastName || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={currentEmployee?.email || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="employeeID"
                label="Employee ID"
                name="employeeID"
                autoComplete="employeeID"
                value={currentEmployee?.employeeID || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={currentEmployee?.username || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                value={currentEmployee?.phone || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="resignation"
                label="Resignation"
                name="resignation"
                autoComplete="resignation"
                value={currentEmployee?.resignation || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="office"
                label="Office"
                name="office"
                autoComplete="office"
                value={currentEmployee?.office || ""}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                value={currentEmployee?.address || ""}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
