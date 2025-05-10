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
  const [rateInputs, setRateInputs] = useState({});


  // ✨ [NEW] After existing states
const [serviceRequests, setServiceRequests] = useState([]);
const [selectedRequest, setSelectedRequest] = useState(null); // For viewing service details
const [requestModalOpen, setRequestModalOpen] = useState(false);

const [pendingApplications, setPendingApplications] = useState(0);
const [pendingServiceRequests, setPendingServiceRequests] = useState(0);

const handleSetRate = async (taskerId) => {
  const rate = rateInputs[taskerId];
  if (!rate) return alert("Please enter a rate");

  try {
    await axios.put(`http://localhost:3000/api/taskers/rate/${taskerId}`, {
      rate: parseFloat(rate),
    });
    alert("Rate updated");
    fetchTaskers();
  } catch (error) {
    console.error("Error setting rate:", error);
    alert("Failed to update rate");
  }
};

// ✨ [NEW] fetchServiceRequests
const fetchServiceRequests = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/clients/requests');
    setServiceRequests(response.data);

    // ✅ Always recalculate the actual number of pending requests
    const pending = response.data.filter(req => !req.status || req.status === "pending").length;
    setPendingServiceRequests(pending);
  } catch (error) {
    console.error('Error fetching service requests:', error);
  }
};


// ✨ [Update] Inside your useEffect where you call fetchCounts(), fetchUsers(), fetchAdmins(), fetchTaskers()
useEffect(() => {
  fetchCounts();
  fetchUsers();
  fetchAdmins();
  fetchTaskers();
  fetchServiceRequests(); // <-- ✨ Add this
}, []);

// ✨ [NEW] Handle Delete Service Request
const handleDeleteServiceRequest = async (clientId) => {
  if (window.confirm("Are you sure you want to delete this service request?")) {
    try {
      await axios.delete(`http://localhost:3000/api/clients/${clientId}`);
      fetchServiceRequests(); // Refresh list after delete
    } catch (error) {
      console.error('Error deleting service request:', error);
    }
  }
};

// ✨ [NEW] Handle View Service Request
const handleViewServiceRequest = (request) => {
  setSelectedRequest(request);
  setRequestModalOpen(true);
};

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
      const response = await axios.get('http://localhost:3000/api/taskers/fullinfo');
      setTaskers(response.data);
  
      // ✨ Count how many taskers are pending
      const pending = response.data.filter(tasker => tasker.status === null || tasker.status === "pending").length;
      setPendingApplications(pending);
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
      try {
        await axios.put(`http://localhost:3000/api/taskers/approve/${id}`);
        fetchTaskers(); // 🔥 Re-fetch from server to update status badge immediately
      } catch (error) {
        console.error("Error approving tasker:", error);
      }
    }
  };
  
  
  
  const handleRejectTasker = async (id) => {
    if (window.confirm("Reject this tasker?")) {
      try {
        await axios.put(`http://localhost:3000/api/taskers/reject/${id}`);
        fetchTaskers(); // 🔥 Re-fetch from server to update status badge immediately
      } catch (error) {
        console.error("Error rejecting tasker:", error);
      }
    }
  };
  

// Approve Service Request
const handleApproveServiceRequest = async (serviceId) => {
  if (window.confirm("Approve this service request?")) {
    try {
      await axios.put(`http://localhost:3000/api/clients/approve/${serviceId}`);
      setServiceRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req.service_id === serviceId) {
            if (req.status === "pending") {
              setPendingServiceRequests(prev => Math.max(prev - 1, 0));
            }
            return { ...req, status: "approved" };
          }
          return req;
        })
      );
    } catch (error) {
      console.error('Error approving service request:', error);
    }
  }
};


const handleSetPendingTasker = async (id) => {
  if (window.confirm("Set this tasker to pending?")) {
    try {
      await axios.put(`http://localhost:3000/api/taskers/pending/${id}`);
      fetchTaskers();
    } catch (error) {
      console.error("Error setting tasker to pending:", error);
    }
  }
}

// Reject Service Request
const handleRejectServiceRequest = async (serviceId) => {
  if (window.confirm("Reject this service request?")) {
    try {
      await axios.put(`http://localhost:3000/api/clients/reject/${serviceId}`);
      setServiceRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req.service_id === serviceId) {
            if (req.status === "pending") {
              setPendingServiceRequests(prev => Math.max(prev - 1, 0));
            }
            return { ...req, status: "rejected" };
          }
          return req;
        })
      );
    } catch (error) {
      console.error('Error rejecting service request:', error);
    }
  }
};


const handleSetPendingServiceRequest = async (serviceId) => {
  if (window.confirm("Set this service request to pending?")) {
    try {
      await axios.put(`http://localhost:3000/api/clients/pending/${serviceId}`);
      await fetchServiceRequests(); // ✅ Recalculate pending count correctly
    } catch (error) {
      console.error("Error setting service request to pending:", error);
    }
  }
};

const getStatusBadge = (status) => {
  if (status === "approved") {
    return <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">Approved</span>;
  }
  if (status === "rejected") {
    return <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">Rejected</span>;
  }
  return <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Pending</span>;
};


  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
      <aside className="w-72 h-screen bg-white text-black flex flex-col justify-between p-4 fixed top-0 left-0 z-40 shadow-md">
          <div>
            <div className="flex items-center mb-10">
              <img src="/logo.png" alt="Logo" className="w-66 h-66 mr-2" />
            </div>
            <div className="text-center mb-6">
  {admin.profile_picture ? (
    <img
      src={`http://localhost:3000${admin.profile_picture}`}
      alt="Admin Profile"
      className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-200 mb-2"
    />
  ) : (
    <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-2 flex items-center justify-center text-gray-500">
      No Image
    </div>
  )}
  <p className="text-lg font-semibold">{`${admin.first_name} ${admin.last_name}`}</p>
  <p className="text-md text-gray-500">Admin</p>
</div>
            <nav className="space-y-2">
            <button
  onClick={() => { setActive("Dashboard"); setSubActive(""); }}
  className={`relative w-full rounded px-5 py-2.5 overflow-hidden group transition-all ease-out duration-300
    ${active === "Dashboard"
      ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
      : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"}
  `}
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold"><HomeIcon className="mr-3 w-5 h-5" /> Dashboard</span>
</button>

<button
  onClick={() => { setActive("Users"); setSubActive(""); }}
  className={`relative w-full rounded px-5 py-2.5 overflow-hidden group transition-all ease-out duration-300
    ${(active === "Users" || subActive === "Clients" || subActive === "Admins")
      ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
      : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"}
  `}
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold"><UsersIcon className="mr-3 w-5 h-5" /> Manage Users</span>
</button>

{/* Applications Button with Pending Badge */}
<button
  onClick={() => { setActive("Applications"); setSubActive(""); }}
  className={`relative w-full rounded px-5 py-2.5 overflow-hidden group transition-all ease-out duration-300
    ${active === "Applications"
      ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
      : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"}
  `}
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold">
    <FileTextIcon className="mr-3 w-5 h-5" />
    Applications
    {pendingApplications > 0 && (
      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {pendingApplications}
      </span>
    )}
  </span>
</button>

{/* Service Requests Button with Pending Badge */}
<button
  onClick={() => { setActive("ServiceRequests"); setSubActive(""); }}
  className={`relative w-full rounded px-5 py-2.5 overflow-hidden group transition-all ease-out duration-300
    ${active === "ServiceRequests"
      ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
      : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"}
  `}
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold">
    <ClipboardListIcon className="mr-3 w-5 h-5" />
    Service Requests
    {pendingServiceRequests > 0 && (
  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
    {pendingServiceRequests}
  </span>
)}
  </span>
</button>

<button
  onClick={() => { setActive("Settings"); setSubActive(""); }}
  className={`relative w-full rounded px-5 py-2.5 overflow-hidden group transition-all ease-out duration-300
    ${active === "Settings"
      ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
      : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"}
  `}
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold"><SettingsIcon className="mr-3 w-5 h-5" /> Settings</span>
</button>

            </nav>
          </div>

          <button
  onClick={handleLogout}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative flex items-center text-base font-semibold">
    <LogOutIcon className="mr-3 w-5 h-5" /> Logout
  </span>
</button>

        </aside>

        {/* Main content */}
       <main className="ml-72 p-6 relative w-[calc(100%-18rem)]">
          {/* Profile Modal (existing) */}
          {modalOpen && selectedProfile && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50 overflow-y-auto p-4">

    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-4 relative">
      <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700 tracking-wide">

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
      <h3 className="text-xl font-semibold text-indigo-700 border-b pb-1 mb-4">Personal Information</h3>

        <p><strong>Full Name:</strong> {selectedProfile.personal?.fullName}</p>
        <p><strong>Birth Date:</strong> {selectedProfile.personal?.birthDate ? new Date(selectedProfile.personal.birthDate).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
}) : "N/A"}</p>
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

{/* Sticky Header */}
<div className="sticky top-0 z-30 bg-gray-100 py-4 px-6 shadow-sm border-b border-gray-200 flex items-center justify-between mb-6">
  <h2 className="text-2xl font-semibold">
    {active === "Dashboard" && "Dashboard Overview"}
    {active === "Users" && "Manage Users"}
    {active === "Applications" && "Service Applications"}
    {active === "ServiceRequests" && "Service Requests"}
    {active === "Settings" && "Admin Settings"}
  </h2>

  <div className="text-lg font-semibold text-gray-700 flex items-center space-x-4">
    <div>🕒 {clock}</div>
    <div>📅 {date}</div>
  </div>
</div>

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
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]  hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative text-base font-semibold">
    Users
  </span>
</button>

<button
  onClick={() => setSubActive("Admins")}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-600 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400
"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative text-base font-semibold">
    Admins
  </span>
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
    <th className="py-3 px-6 text-right">Actions</th> {/* ✨ Change text-center -> text-right */}
  </tr>
</thead>
<tbody className="text-gray-600 text-sm font-light">
  {users.map((user) => (
    <tr key={user.id} className="border-b hover:bg-gray-100 transition duration-300">
      <td className="py-3 px-6 text-left">{user.first_name}</td>
      <td className="py-3 px-6 text-left">{user.last_name}</td>
      <td className="py-3 px-6 text-right space-x-2"> {/* ✨ Change text-center -> text-right */}
        <button
          onClick={() => handleViewProfile(user.id)}
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]  hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-base font-semibold">View Profile</span>
        </button>

        <button
          onClick={() => handleDeleteUser(user.id)}
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-red-600 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400
"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-base font-semibold">Delete</span>
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
    <th className="py-3 px-6 text-right">Actions</th> {/* ✨ Change text-center -> text-right */}
  </tr>
</thead>
<tbody className="text-gray-600 text-sm font-light">
  {admins.map((admin) => (
    <tr key={admin.id} className="border-b hover:bg-gray-100 transition duration-300">
      <td className="py-3 px-6 text-left">{admin.first_name}</td>
      <td className="py-3 px-6 text-left">{admin.last_name}</td>
      <td className="py-3 px-6 text-right space-x-2"> {/* ✨ Change text-center -> text-right */}
        <button
          onClick={() => handleViewAdminProfile(admin.id)}
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]  hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-base font-semibold">View Profile</span>
        </button>

        <button
          onClick={() => handleDeleteAdmin(admin.id)}
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-base font-semibold">Delete</span>
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
  <div className="h-full flex flex-col max-h-[calc(100vh-200px)]">
    <p className="mb-4">
      Manage service applications easily. You can view complete profiles, approve qualified applicants, or reject if necessary.
    </p>

    {/* ✨ Scrollable tasker cards */}  
    <div className="flex flex-col gap-5 overflow-y-auto pr-2">
      {taskers.map((tasker) => (
        <div
          key={tasker.id}
          className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between hover:shadow-xl transition-all"
        >
          {/* Left Info */}
          <div className="flex items-center gap-4">
            <img
              src={`http://localhost:3000${tasker.profilePicture}`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800">{tasker.fullName}</h3>
              <p className="text-sm text-gray-600">Age: {tasker.age || "N/A"} | Gender: {tasker.gender || "N/A"}</p>
<p className="text-sm text-gray-600">
  Job: {Array.isArray(tasker.jobType) && tasker.jobType.length > 0 ? tasker.jobType.join(", ") : "N/A"}
</p>

<p className="text-sm text-gray-600">
  Category: {tasker.serviceCategory && typeof tasker.serviceCategory === "object" && Object.keys(tasker.serviceCategory).length > 0
    ? Object.values(tasker.serviceCategory).join(", ")
    : "N/A"}
</p>

<p className="text-sm text-gray-600">
  Experience: {tasker.experience ? `${tasker.experience} yrs` : "N/A"}
</p>

<p className="text-sm text-gray-600">
  Rate: {tasker.rate_per_hour ? `₱${tasker.rate_per_hour}/hr` : "N/A"}
</p>


              <div>{getStatusBadge(tasker.status)}</div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col gap-2 w-64">
            <button
              onClick={() => handleViewTaskerProfile(tasker.id)}
              className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700"
            >
              View
            </button>
            <button
              onClick={() => handleApproveTasker(tasker.id)}
              className="bg-green-600 text-white px-3 py-1.5 text-sm rounded hover:bg-green-500"
            >
              Approve
            </button>
            <button
              onClick={() => handleRejectTasker(tasker.id)}
              className="bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-400"
            >
              Reject
            </button>
            <button
              onClick={() => handleSetPendingTasker(tasker.id)}
              className="bg-yellow-500 text-white px-3 py-1.5 text-sm rounded hover:bg-yellow-400"
            >
              Pending
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{active === "ServiceRequests" && (
  <div>
    <p className="mb-6">
    Manage and review client service submissions. View their profiles, and decide to approve or reject based on qualifications.
    </p>

    {/* ✨ Card layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
      {serviceRequests.map((request) => (
        <div
          key={request.client_id}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-[250px] transition-transform transform hover:scale-[1.02] hover:shadow-2xl duration-300"
        >
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-md mb-4">
            <img
              src={`http://localhost:3000${request.profile_picture}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Client Info */}
          <h3 className="text-lg font-bold text-gray-800 mb-1 text-center break-words">
            {request.first_name} {request.last_name}
          </h3>
          <p className="text-indigo-700 font-semibold text-center text-sm mt-2">
            {request.barangay}, {request.street}
          </p>

          {/* ✨ Service Need */}
          <p className="text-indigo-700 font-semibold text-center text-sm mt-2">
            Service Need: {request.service_type}
          </p>

          {/* Status Badge */}
          <div className="mb-3 mt-2">
          {request.status === "approved" && (
  <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">Approved</span>
)}
{request.status === "rejected" && (
  <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">Rejected</span>
)}
{(!request.status || request.status === "pending") && (
  <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Pending</span>
)}

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full mt-4">
          <button
  onClick={() => handleViewServiceRequest(request)}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]  hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative text-base font-semibold">View Request</span>
</button>

<button
  onClick={() => handleApproveServiceRequest(request.service_id)}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-600 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative text-base font-semibold">Approve</span>
</button>

<button
  onClick={() => handleRejectServiceRequest(request.service_id, request.client_id)}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300"
>
  <span className="relative text-base font-semibold">Reject</span>
</button>
<button
  onClick={() => handleSetPendingServiceRequest(request.service_id)}
  className="relative rounded px-5 py-2.5 overflow-hidden group bg-yellow-500 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-yellow-400 transition-all ease-out duration-300"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span className="relative text-base font-semibold">Pending</span>
</button>


          </div>
        </div>
      ))}
    </div>
  
    {/* 🚀 THIS PART IS YOUR SERVICE REQUEST MODAL */}
    {requestModalOpen && selectedRequest && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50 overflow-y-auto p-4">

        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-6 relative border border-gray-200">

          <button onClick={() => setRequestModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>

          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Service Request Details</h2>

          <div className="text-gray-700 space-y-4">
            <div className="flex flex-col items-center">
              <img
                src={`http://localhost:3000${selectedRequest.profile_picture}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-bold">{selectedRequest.first_name} {selectedRequest.last_name}</h3>
            </div>

            <p><strong>Contact Number:</strong> {selectedRequest.contact_number}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Address:</strong> {selectedRequest.street}, {selectedRequest.barangay}, {selectedRequest.additional_address}</p>
            <p><strong>Service Type:</strong> {selectedRequest.service_type}</p>
            <p><strong>Service Description:</strong> {selectedRequest.service_description}</p>
            <p>
  <strong>Preferred Date:</strong>{" "}
  {new Date(selectedRequest.preferred_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</p>

<p>
  <strong>Preferred Time:</strong>{" "}
  {new Date(`1970-01-01T${selectedRequest.preferred_time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}
</p>
            <p><strong>Urgent Request:</strong> {selectedRequest.urgent_request ? "Yes" : "No"}</p>

            {/* Service Image */}
            {selectedRequest.service_image && (
              <div>
                <h3 className="font-semibold mb-2">Service Image:</h3>
                <img
                  src={`http://localhost:3000${selectedRequest.service_image}`}
                  alt="Service"
                  className="w-full h-60 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {active === "Settings" && <p>Update admin preferences or system config.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

