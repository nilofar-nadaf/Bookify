import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../index.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "users");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    tag: "",
    language: "",
    inStock: true,
    description: "",
    image: "",
  });

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));

    if (!storedAdmin || storedAdmin.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    setAdminUser(storedAdmin);
  }, [navigate]);

  useEffect(() => {
    if (!adminUser) return;
    fetchUsers();
    fetchBooks();
    fetchOrders();
    fetchCategories();
  }, [adminUser]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "users";
    setActiveTab(tabFromUrl);
  }, [searchParams]);
  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };


  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Admin users fetch failed:", error);
      alert("Unable to load users.");
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/books");
      setBooks(res.data || []);
    } catch (error) {
      console.error("Admin books fetch failed:", error);
      alert("Unable to load books.");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Admin orders fetch failed:", error);
      alert("Unable to load orders.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Admin categories fetch failed:", error);
      alert("Unable to load categories.");
    }
  };

  const handleBookFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...bookForm,
        price: Number(bookForm.price),
      };
      const url = editingBookId
        ? `http://localhost:5000/api/admin/books/${editingBookId}`
        : "http://localhost:5000/api/admin/books";
      const method = editingBookId ? "put" : "post";
      const res = await axios[method](url, payload);
      alert(res.data.message || (editingBookId ? "Book updated" : "Book added"));
      setBookForm({
        title: "",
        author: "",
        price: "",
        category: "",
        tag: "",
        language: "",
        inStock: true,
        description: "",
        image: "",
      });
      setEditingBookId(null);
      fetchBooks();
      fetchCategories();
      changeTab("books");
    } catch (error) {
      console.error("Save book failed:", error);
      alert(error?.response?.data?.message || "Unable to save book.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/books/${bookId}`);
      alert(res.data.message || "Book deleted");
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Delete book failed:", error);
      alert(error?.response?.data?.message || "Unable to delete book.");
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      category: book.category || "",
      tag: book.tag || "",
      language: book.language || "",
      inStock: Boolean(book.inStock),
      description: book.description || "",
      image: book.image || "",
    });
    changeTab("addBook");
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setBookForm({
      title: "",
      author: "",
      price: "",
      category: "",
      tag: "",
      language: "",
      inStock: true,
      description: "",
      image: "",
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/categories", {
        name: newCategoryName,
      });
      alert(res.data.message || "Category added");
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Add category failed:", error);
      alert(error?.response?.data?.message || "Unable to add category.");
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/categories/${categoryId}`, {
        name: editingCategoryName,
      });
      alert(res.data.message || "Category updated");
      setEditingCategoryId(null);
      setEditingCategoryName("");
      fetchCategories();
      fetchBooks();
    } catch (error) {
      console.error("Update category failed:", error);
      alert(error?.response?.data?.message || "Unable to update category.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/categories/${categoryId}`);
      alert(res.data.message || "Category deleted");
      fetchCategories();
      fetchBooks();
    } catch (error) {
      console.error("Delete category failed:", error);
      alert(error?.response?.data?.message || "Unable to delete category.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        status,
      });
      alert(res.data.message || "Order status updated");
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    } catch (error) {
      console.error("Update status failed:", error);
      alert(error?.response?.data?.message || "Unable to update order status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <main className="shop-wrapper">
      <section className="admin-dashboard-card fade-in">
        <div className="admin-dashboard-topbar">
          <div>
            <p className="section-tag">Admin Panel</p>
            <h1 className="title-text">Admin Dashboard</h1>
            {adminUser && (
              <p className="admin-subtitle">
                Welcome, <strong>{adminUser.full_name}</strong> ({adminUser.email})
              </p>
            )}
          </div>
          <button className="logout-btn-card" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => changeTab("users")}
          >
            All Users
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "books" ? "active" : ""}`}
            onClick={() => changeTab("books")}
          >
            All Books
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "addBook" ? "active" : ""}`}
            onClick={() => changeTab("addBook")}
          >
            Add Book
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => changeTab("orders")}
          >
            All Orders
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => changeTab("categories")}
          >
            Categories
          </button>
        </div>

        {activeTab === "users" && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "books" && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>Rs.{book.price}</td>
                    <td>{book.category || "-"}</td>
                    <td>
                      <button
                        className="admin-edit-btn"
                        onClick={() => handleEditBook(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "addBook" && (
          <form className="admin-book-form" onSubmit={handleAddBook}>
            <h3>{editingBookId ? "Edit Book" : "Add New Book"}</h3>
            <input name="title" placeholder="Title" value={bookForm.title} onChange={handleBookFormChange} required />
            <input name="author" placeholder="Author" value={bookForm.author} onChange={handleBookFormChange} required />
            <input name="price" type="number" placeholder="Price" value={bookForm.price} onChange={handleBookFormChange} required />
            <select name="category" value={bookForm.category} onChange={handleBookFormChange}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="tag" placeholder="Tag" value={bookForm.tag} onChange={handleBookFormChange} />
            <input name="language" placeholder="Language" value={bookForm.language} onChange={handleBookFormChange} />
            <input name="image" placeholder="Image URL" value={bookForm.image} onChange={handleBookFormChange} />
            <textarea
              name="description"
              placeholder="Description"
              value={bookForm.description}
              onChange={handleBookFormChange}
            />
            <label className="admin-checkbox-row">
              <input
                name="inStock"
                type="checkbox"
                checked={bookForm.inStock}
                onChange={handleBookFormChange}
              />
              In Stock
            </label>
            <button className="auth-action-btn signup" type="submit">
              {editingBookId ? "Update Book" : "Add Book"}
            </button>
            {editingBookId && (
              <button type="button" className="reset-filter-btn" onClick={resetBookForm}>
                Cancel Edit
              </button>
            )}
          </form>
        )}

        {activeTab === "orders" && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Book</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_code}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.book_title}</td>
                    <td>{order.quantity}</td>
                    <td>Rs.{Number(order.total_amount).toFixed(2)}</td>
                    <td>{order.address}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="admin-status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="admin-category-panel">
            <form className="admin-category-form" onSubmit={handleAddCategory}>
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                required
              />
              <button className="auth-action-btn signup" type="submit">
                Add Category
              </button>
            </form>

            <div className="admin-category-list">
              {categories.map((category) => (
                <div key={category.id} className="admin-category-item">
                  {editingCategoryId === category.id ? (
                    <>
                      <input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                      />
                      <button
                        className="admin-edit-btn"
                        onClick={() => handleUpdateCategory(category.id)}
                      >
                        Save
                      </button>
                      <button
                        className="reset-filter-btn"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setEditingCategoryName("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{category.name}</span>
                      <button
                        className="admin-edit-btn"
                        onClick={() => {
                          setEditingCategoryId(category.id);
                          setEditingCategoryName(category.name);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
