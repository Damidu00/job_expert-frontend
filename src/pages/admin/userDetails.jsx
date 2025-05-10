import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token not found in localStorage.");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/users/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data?.message || error.message);
        alert("Failed to fetch users. Please check your connection or login again.");
      }
    };
    fetchUsers();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = users.filter(user =>
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:5000/api/users/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter(user => user._id !== userId);
        setFilteredUsers(updatedUsers.filter(user =>
          user.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        return updatedUsers;
      });
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data?.message || error.message);
      toast.error("Error deleting user. Check console for details.");
    }
  };

  const downloadPDF = () => {
    try {
      if (!filteredUsers || filteredUsers.length === 0) {
        toast.error("No users data available to generate PDF");
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add company name in blue
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setTextColor(41, 128, 185); // Blue color
      doc.text("Job Xpert", pageWidth / 2, 20, { align: 'center' });
      
      // Add table title in black
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text("User Management System", pageWidth / 2, 35, { align: 'center' });
      
      // Prepare data for the table
      const tableColumn = ["Full Name", "Email", "Role"];
      const tableRows = filteredUsers.map(user => [
        user.fullname || "N/A",
        user.email || "N/A",
        user.role || "N/A"
      ]);

      // Add the table using autoTable with modern styling
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        margin: { top: 20 },
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 12,
          halign: 'center',
          cellPadding: 6
        },
        styles: {
          fontSize: 11,
          cellPadding: 5,
          overflow: 'linebreak',
          halign: 'left',
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        columnStyles: {
          0: { cellWidth: 60, halign: 'left' },
          1: { cellWidth: 80, halign: 'left' },
          2: { cellWidth: 40, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
        didDrawPage: function(data) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const pageCount = doc.internal.getNumberOfPages();
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        },
        didDrawCell: function (data) {
          // Remove right border for the last column (Role)
          if (data.column.index === 2 && data.cell.section === 'body') {
            const { table, cell } = data;
            const doc = data.doc;
            doc.setDrawColor(255, 255, 255); // Set to white (invisible)
            doc.setLineWidth(0.1);
            doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
            doc.setDrawColor(200, 200, 200); // Reset to default
          }
        }
      });

      // Save the PDF
      doc.save("user_list.pdf");
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA25hVk1y2o2qy1XJeZB7Bsq7Y6tUvj3kIRQ&s')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden relative p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">USER LIST</h1>
          <div className="flex gap-4 items-center">
            <TextField
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              className="bg-white rounded-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" onClick={downloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 border-separate">
            <tr>
              <th className="px-4 py-2 text-black font-semibold">Full Name</th>
              <th className="px-4 py-2 text-black font-semibold">Email</th>
              <th className="px-4 py-2 text-black font-semibold">Role</th>
              <th className="px-4 py-2 text-black font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{user.fullname}</td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.role}</td>
                  <td className="px-4 py-3">
                    <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  {searchQuery ? "No users found matching your search." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;
