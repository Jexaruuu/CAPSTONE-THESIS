import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, UsersIcon, FileTextIcon, LogOutIcon, SettingsIcon, ClipboardListIcon } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [subActive, setSubActive] = useState("");
  const [admin, setAdminName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString("en-US"));
  const [counts, setCounts] = useState({ admins: 0, users: 0 });
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [taskers, setTaskers] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isTaskerProfile, setIsTaskerProfile] = useState(false); // ✅ New state to track if tasker

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString());
      setDate(now.toLocaleDateString("en-US"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/adminlogin");
    } else {
      axios.get(`http://localhost:3000/api/admin/${userId}`)
        .then((res) => setAdminName(res.data))
        .catch((err) => {
          console.error("Failed to fetch admin data:", err);
          navigate("/adminlogin");
        });
    }
  }, [navigate]);

  const fetchCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/count/count');
      setCounts(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const fetchTaskers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/taskers');
      setTaskers(response.data);
    } catch (error) {
      console.error('Error fetching taskers:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchUsers();
    fetchAdmins();
    fetchTaskers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    axios.post("http://localhost:3000/api/logout")
      .then(() => navigate("/adminlogin"))
      .catch((err) => console.error("Logout failed:", err));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/user/${userId}`, { withCredentials: true });
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/${adminId}`, { withCredentials: true });
        fetchAdmins();
        fetchCounts();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
      setSelectedProfile(response.data);
      setIsTaskerProfile(false); // ✅ It is a normal user
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleViewAdminProfile = async (adminId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admins/${adminId}`);
      setSelectedProfile(response.data);
      setIsTaskerProfile(false); // ✅ It is a normal admin
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    }
  };

  // ✅ New: handleViewTaskerProfile
  const handleViewTaskerProfile = async (taskerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/taskers/${taskerId}`);
      setSelectedProfile(response.data);
      setIsTaskerProfile(true); // ✅ It is a tasker
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch tasker profile:", error);
    }
  };

  const handleApproveTasker = async (id) => {
    if (window.confirm("Approve this tasker?")) {
      await axios.put(`http://localhost:3000/api/taskers/approve/${id}`);
      fetchTaskers();
    }
  };

  const handleRejectTasker = async (id) => {
    if (window.confirm("Reject this tasker?")) {
      await axios.put(`http://localhost:3000/api/taskers/reject/${id}`);
      fetchTaskers();
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") return <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">Approved</span>;
    if (status === "rejected") return <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">Rejected</span>;
    return <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Pending</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
        <aside className="w-64 h-screen bg-white text-black flex flex-col justify-between p-4">
          <div>
            <div className="flex items-center mb-10">
              <img src="/logo.png" alt="Logo" className="w-56 h-56 mr-2" />
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">{`${admin.first_name} ${admin.last_name}`}</p>
              <p className="text-md text-gray-500">Admin</p>
            </div>
            <nav className="space-y-2">
              <button onClick={() => { setActive("Dashboard"); setSubActive(""); }} className={`relative w-full rounded px-4 py-2.5 ${active === "Dashboard" ? "bg-[#000081] text-white" : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white"}`}>
                <span className="relative flex items-center text-base font-semibold"><HomeIcon className="mr-3 w-5 h-5" /> Dashboard</span>
              </button>
              <button onClick={() => { setActive("Users"); setSubActive(""); }} className={`relative w-full rounded px-4 py-2.5 ${(active === "Users" || subActive === "Clients" || subActive === "Admins") ? "bg-[#000081] text-white" : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white"}`}>
                <span className="relative flex items-center text-base font-semibold"><UsersIcon className="mr-3 w-5 h-5" /> Manage Users</span>
              </button>
              <button onClick={() => { setActive("Applications"); setSubActive(""); }} className={`relative w-full rounded px-4 py-2.5 ${active === "Applications" ? "bg-[#000081] text-white" : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white"}`}>
                <span className="relative flex items-center text-base font-semibold"><FileTextIcon className="mr-3 w-5 h-5" /> Applications</span>
              </button>
              <button onClick={() => { setActive("ServiceRequests"); setSubActive(""); }} className={`relative w-full rounded px-4 py-2.5 ${active === "ServiceRequests" ? "bg-[#000081] text-white" : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white"}`}>
                <span className="relative flex items-center text-base font-semibold"><ClipboardListIcon className="mr-3 w-5 h-5" /> Service Requests</span>
              </button>
              <button onClick={() => { setActive("Settings"); setSubActive(""); }} className={`relative w-full rounded px-4 py-2.5 ${active === "Settings" ? "bg-[#000081] text-white" : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white"}`}>
                <span className="relative flex items-center text-base font-semibold"><SettingsIcon className="mr-3 w-5 h-5" /> Settings</span>
              </button>
            </nav>
          </div>

          <button onClick={handleLogout} className="relative w-full rounded px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold">
            <span className="relative flex items-center text-base"><LogOutIcon className="mr-3 w-5 h-5" /> Logout</span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 relative">
          {/* Profile Modal (existing) */}
          {modalOpen && selectedProfile && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-4 relative">
      <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
        {isTaskerProfile ? "Tasker Full Profile" : "Profile Details"}
      </h2>

      {/* Normal User/Admin View */}
      {!isTaskerProfile && (
        <div className="space-y-2 text-left text-gray-700">
          <p><strong>First Name:</strong> {selectedProfile.first_name}</p>
          <p><strong>Last Name:</strong> {selectedProfile.last_name}</p>
          {selectedProfile.email && <p><strong>Email:</strong> {selectedProfile.email}</p>}
          {selectedProfile.mobile && <p><strong>Mobile:</strong> {selectedProfile.mobile}</p>}
          {selectedProfile.address && <p><strong>Address:</strong> {selectedProfile.address}</p>}
          {selectedProfile.birth_date && <p><strong>Birth Date:</strong> {selectedProfile.birth_date}</p>}
          {selectedProfile.gender && <p><strong>Gender:</strong> {selectedProfile.gender}</p>}
          {selectedProfile.created_at && <p><strong>Joined:</strong> {new Date(selectedProfile.created_at).toLocaleDateString()}</p>}
        </div>
      )}

      {/* Tasker Full Details */}
      {isTaskerProfile && (
  <div className="text-left text-gray-700 flex flex-col md:flex-row gap-6">
    {/* Left Side - Information */}
    <div className="flex-1 space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-lg font-bold text-indigo-600 mb-2">Personal Information</h3>
        <p><strong>Full Name:</strong> {selectedProfile.personal?.fullName}</p>
        <p><strong>Birth Date:</strong> {selectedProfile.personal?.birthDate}</p>
        <p><strong>Age:</strong> {selectedProfile.personal?.age}</p>
        <p><strong>Gender:</strong> {selectedProfile.personal?.gender}</p>
        <p><strong>Contact:</strong> {selectedProfile.personal?.contactNumber}</p>
        <p><strong>Email:</strong> {selectedProfile.personal?.email}</p>
        <p><strong>Address:</strong> {selectedProfile.personal?.address}</p>
      </div>

      {/* Professional Info */}
      <div>
        <h3 className="text-lg font-bold text-indigo-600 mb-2">Professional Information</h3>
        <p><strong>Job Type:</strong> {selectedProfile.professional?.jobType}</p>
        <p><strong>Service Category:</strong> {selectedProfile.professional?.serviceCategory}</p>
        <p><strong>Years of Experience:</strong> {selectedProfile.professional?.experience}</p>
        <p><strong>Skills:</strong> {selectedProfile.professional?.skills}</p>
      </div>

      {/* Government Info */}
      <div>
        <h3 className="text-lg font-bold text-indigo-600 mb-2">Government Numbers</h3>
        <p><strong>TIN Number:</strong> {selectedProfile.government?.tinNumber}</p>
        <p><strong>SSS Number:</strong> {selectedProfile.government?.sssNumber}</p>
        <p><strong>PhilHealth Number:</strong> {selectedProfile.government?.philHealthNumber}</p>
        <p><strong>Pag-IBIG Number:</strong> {selectedProfile.government?.pagIbigNumber}</p>
      </div>
    </div>

    {/* Right Side - Documents */}
    <div className="flex-1 space-y-4 overflow-y-auto max-h-[80vh]">
      <h3 className="text-lg font-bold text-indigo-600 mb-2">Uploaded Documents</h3>

      {/* Primary ID Front */}
      <div>
        <p className="font-semibold">Primary ID Front:</p>
        {selectedProfile.documents?.primaryIDFront ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.primaryIDFront}`}
            alt="Primary ID Front"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Primary ID Back */}
      <div>
        <p className="font-semibold">Primary ID Back:</p>
        {selectedProfile.documents?.primaryIDBack ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.primaryIDBack}`}
            alt="Primary ID Back"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Secondary ID */}
      <div>
        <p className="font-semibold">Secondary ID:</p>
        {selectedProfile.documents?.secondaryID ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.secondaryID}`}
            alt="Secondary ID"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Clearance */}
      <div>
        <p className="font-semibold">Clearance:</p>
        {selectedProfile.documents?.clearance ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.clearance}`}
            alt="Clearance"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Proof of Address */}
      <div>
        <p className="font-semibold">Proof of Address:</p>
        {selectedProfile.documents?.proofOfAddress ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.proofOfAddress}`}
            alt="Proof of Address"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Medical Certificate */}
      <div>
        <p className="font-semibold">Medical Certificate:</p>
        {selectedProfile.documents?.medicalCertificate ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.medicalCertificate}`}
            alt="Medical Certificate"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Certificates */}
      <div>
        <p className="font-semibold">Certificates:</p>
        {selectedProfile.documents?.certificates ? (
          <img
            src={`http://localhost:3000${selectedProfile.documents.certificates}`}
            alt="Certificates"
            className="w-full h-40 object-cover rounded-lg border"
          />
        ) : (
          <p className="text-sm text-gray-500">No image uploaded</p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  </div>
)}

            {/* Clock & Date */}
            <div className="absolute top-6 right-6 text-lg font-semibold text-gray-700 flex items-center space-x-4">
            <div>🕒 {clock}</div>
            <div>📅 {date}</div>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {active === "Dashboard" && "Dashboard Overview"}
            {active === "Users" && "Manage Users"}
            {active === "Applications" && "Service Applications"}
            {active === "ServiceRequests" && "Service Requests"}
            {active === "Settings" && "Admin Settings"}
          </h2>

          <div className="bg-white p-6 rounded-lg">
            {active === "Dashboard" && (
              <>
                <p className="mb-6">Welcome, Admin! Here’s a quick look at users and admins count.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
                    <p className="text-lg font-semibold text-blue-800">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900">{counts.users}</p>
                  </div>
                  <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
                    <p className="text-lg font-semibold text-green-800">Total Admins</p>
                    <p className="text-3xl font-bold text-green-900">{counts.admins}</p>
                  </div>
                </div>
              </>
            )}

            {active === "Users" && (
              <>
                <p className="mb-6">Manage the users and admins easily from here.</p>
                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={() => setSubActive("Clients")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      subActive === "Clients"
                        ? "bg-blue-700 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setSubActive("Admins")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      subActive === "Admins"
                        ? "bg-green-700 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    Admins
                  </button>
                </div>
              </>
            )}

            {subActive === "Clients" && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-blue-700">Users List</h3>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">First Name</th>
                        <th className="py-3 px-6 text-left">Last Name</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-100 transition duration-300">
                          <td className="py-3 px-6 text-left">{user.first_name}</td>
                          <td className="py-3 px-6 text-left">{user.last_name}</td>
                          <td className="py-3 px-6 text-center space-x-2">
                            <button
                              onClick={() => handleViewProfile(user.id)}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {subActive === "Admins" && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-green-700">Admins List</h3>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-green-100 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">First Name</th>
                        <th className="py-3 px-6 text-left">Last Name</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b hover:bg-gray-100 transition duration-300">
                          <td className="py-3 px-6 text-left">{admin.first_name}</td>
                          <td className="py-3 px-6 text-left">{admin.last_name}</td>
                          <td className="py-3 px-6 text-center space-x-2">
                            <button
                              onClick={() => handleViewAdminProfile(admin.id)}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

             {/* ✨ New Applications View ✨ */}
             {active === "Applications" && (
  <div>
    <p className="mb-6">
      Manage service applications easily. You can view complete profiles, approve qualified applicants, or reject if necessary.
    </p>

    {/* ✨ Final Fix: no max-w, just w-full inside tight grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
      {taskers.map((tasker) => (
        <div
          key={tasker.id}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-[250px] transition-transform transform hover:scale-[1.02] hover:shadow-2xl duration-300"
        >
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-md mb-4">
            <img
              src={`http://localhost:3000${tasker.profilePicture}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Info */}
          <h3 className="text-lg font-bold text-gray-800 mb-1 text-center break-words">
            {tasker.fullName}
          </h3>
          <p className="text-gray-600 mb-1 text-sm">
            Age: <span className="font-semibold">{tasker.age}</span>
          </p>
          <p className="text-blue-700 font-semibold text-sm mb-2">
            {tasker.jobType}
          </p>

          {/* Status Badge */}
          <div className="mb-3">{getStatusBadge(tasker.status)}</div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => handleViewTaskerProfile(tasker.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-300 w-full text-sm"
            >
              View
            </button>
            <button
              onClick={() => handleApproveTasker(tasker.id)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 rounded-lg transition-all duration-300 w-full text-sm"
            >
              Approve
            </button>
            <button
              onClick={() => handleRejectTasker(tasker.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 rounded-lg transition-all duration-300 w-full text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            {active === "ServiceRequests" && <p>All submitted service requests will be displayed here.</p>}
            {active === "Settings" && <p>Update admin preferences or system config.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

