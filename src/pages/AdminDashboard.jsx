import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("surveys");
  const [surveys, setSurveys] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
    type: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchSurveys(), fetchProjects(), fetchContacts()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Notification handling
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      5000
    );
  };

  const fetchSurveys = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/surveys");
      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      showNotification("Failed to fetch surveys", "error");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showNotification("Failed to fetch projects", "error");
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contactus");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showNotification("Failed to fetch contacts", "error");
    }
  };

  const handleAdd = async (type) => {
    // Validate required fields
    const requiredFields =
      type === "surveys"
        ? ["section", "query", "answer"]
        : ["title", "description"];

    const missingFields = requiredFields.filter((field) => !newEntry[field]);
    if (missingFields.length > 0) {
      showNotification(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

    const endpoint =
      type === "surveys"
        ? "http://localhost:5000/api/surveys"
        : "http://localhost:5000/api/projects";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        const createdItem = await response.json();
        if (type === "surveys") setSurveys([...surveys, createdItem.survey]);
        else if (type === "projects")
          setProjects([...projects, createdItem.project]);
        setShowModal(false);
        setNewEntry({});
        showNotification(`${type.slice(0, -1)} added successfully`);
      } else {
        throw new Error(`Failed to add ${type.slice(0, -1)}`);
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      showNotification(`Failed to add ${type.slice(0, -1)}`, "error");
    }
  };

  const handleDelete = async (id, type) => {
    const endpoint =
      type === "surveys"
        ? `http://localhost:5000/api/surveys/${id}`
        : type === "projects"
        ? `http://localhost:5000/api/projects/${id}`
        : `http://localhost:5000/api/contactus/${id}`;

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (response.ok) {
        if (type === "surveys")
          setSurveys(surveys.filter((item) => item._id !== id));
        else if (type === "projects")
          setProjects(projects.filter((item) => item._id !== id));
        else setContacts(contacts.filter((item) => item._id !== id));
        showNotification(`${type.slice(0, -1)} deleted successfully`);
      } else {
        throw new Error(`Failed to delete ${type.slice(0, -1)}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showNotification(`Failed to delete ${type.slice(0, -1)}`, "error");
    }
    setDeleteConfirmation({ show: false, id: null, type: null });
  };

  // Delete Confirmation Dialog
  const DeleteConfirmationDialog = () => {
    if (!deleteConfirmation.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
          </div>
          <p className="mb-6">
            Are you sure you want to delete this{" "}
            {deleteConfirmation.type.slice(0, -1)}? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setDeleteConfirmation({ show: false, id: null, type: null })
              }
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                handleDelete(deleteConfirmation.id, deleteConfirmation.type)
              }
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = (type) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New {type.slice(0, -1)}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {type === "surveys" && (
          <>
            <input
              type="text"
              placeholder="Section *"
              value={newEntry.section || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, section: e.target.value })
              }
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Query *"
              value={newEntry.query || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, query: e.target.value })
              }
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Answer *"
              value={newEntry.answer || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, answer: e.target.value })
              }
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </>
        )}
        {type === "projects" && (
          <>
            <input
              type="text"
              placeholder="Title *"
              value={newEntry.title || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, title: e.target.value })
              }
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description *"
              value={newEntry.description || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            />
          </>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAdd(type)}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  // Notification component
  const NotificationAlert = () => {
    if (!notification.show) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${
            notification.type === "error"
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          {notification.type === "error" ? (
            <AlertTriangle className="text-red-500" size={20} />
          ) : (
            <CheckCircle className="text-green-500" size={20} />
          )}
          <p
            className={`${
              notification.type === "error" ? "text-red-700" : "text-green-700"
            }`}
          >
            {notification.message}
          </p>
          <button
            onClick={() =>
              setNotification({ show: false, message: "", type: "success" })
            }
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Tab navigation */}
        <div className="bg-white mb-6 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {["surveys", "projects", "contacts"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {activeTab !== "contacts" && (
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  onClick={() => {
                    setShowModal(true);
                    setNewEntry({});
                  }}
                >
                  <Plus size={20} />
                  Add New
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                {activeTab === "surveys" && (
                  <div>
                    {surveys.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p className="text-lg font-medium">No surveys found</p>
                        <p>
                          There are currently no entries in the surveys
                          database.
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Section
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Query
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Answer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {surveys.map((survey) => (
                            <tr key={survey._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">
                                {survey.section}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {survey.query}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {survey.answer}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      show: true,
                                      id: survey._id,
                                      type: "surveys",
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div>
                    {projects.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p className="text-lg font-medium">No projects found</p>
                        <p>
                          There are currently no entries in the projects
                          database.
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {projects.map((project) => (
                            <tr key={project._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">
                                {project.title}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {project.description}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      show: true,
                                      id: project._id,
                                      type: "projects",
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeTab === "contacts" && (
                  <div>
                    {contacts.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p className="text-lg font-medium">No contacts found</p>
                        <p>
                          There are currently no entries in the contacts
                          database.
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Message
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {contacts.map((contact) => (
                            <tr key={contact._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">
                                {contact.name}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {contact.email}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {contact.message}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      show: true,
                                      id: contact._id,
                                      type: "contacts",
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals and Alerts */}
      {showModal && renderModal(activeTab)}
      <DeleteConfirmationDialog />
      <NotificationAlert />
    </div>
  );
};

export default AdminDashboard;
