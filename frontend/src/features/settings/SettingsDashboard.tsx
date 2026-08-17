import React, { useState, useEffect } from "react";
import { FaUser, FaRegEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { getUserProfile, updateUserProfile, changePassword } from "../../api/auth.api";
import "../../styles/settings.css";

interface UserProfile {
  id?: number;
  nombre: string;
  apellido?: string;
  telefono?: string;
  email: string;
}

type EditableField = "nombre" | "apellido" | "telefono";

// Función auxiliar para enmascarar el email
const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return "Sin correo registrado";

  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }

  const visibleChars = username.slice(0, 2);
  const maskedSection = "*".repeat(Math.min(username.length - 2, 5));

  return `${visibleChars}${maskedSection}@${domain}`;
};

export default function SettingsDashboard() {
  const [user, setUser] = useState<UserProfile>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const [passwords, setPasswords] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();

      // Mapeo flexible por si la API retorna en data o data.user
      const rawUser = (data as any).user || data;

      setUser({
        id: rawUser.id,
        nombre: rawUser.nombre || rawUser.firstName || rawUser.name || "",
        apellido: rawUser.apellido || rawUser.lastName || "",
        telefono: rawUser.telefono || rawUser.phone || "",
        email: rawUser.email || "",
      });
    } catch (err) {
      console.error("Error al obtener perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: EditableField) => {
    setEditingField(field);
    setTempValue(user[field] ? String(user[field]) : "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async (field: EditableField) => {
    try {
      const updatedUser = { ...user, [field]: tempValue };
      await updateUserProfile({ [field]: tempValue });
      setUser(updatedUser);
      setEditingField(null);
    } catch (err) {
      alert("Error al actualizar la información.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.passwordNueva !== passwords.confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      await changePassword({
        passwordActual: passwords.passwordActual,
        passwordNueva: passwords.passwordNueva,
      });
      alert("Contraseña actualizada correctamente.");
      setPasswords({ passwordActual: "", passwordNueva: "", confirmarPassword: "" });
    } catch (err) {
      alert("Error al cambiar la contraseña.");
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <FaSpinner className="spinner" />
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  const fullName = `${user.nombre} ${user.apellido}`.trim() || "Usuario";

  return (
    <div className="settings-container">
      {/* Header Unificado */}
      <div className="profile-header-card">
        <div className="avatar-circle">
          <FaUser className="avatar-icon" />
        </div>
        <div className="profile-info-text">
          <h2 className="profile-name">{fullName}</h2>
          <p className="profile-email">{maskEmail(user.email)}</p>
        </div>
      </div>

      {/* Sección Información Personal */}
      <div className="settings-card">
        <h3 className="settings-card-title">Información Personal</h3>

        {/* Campo Nombre */}
        <div className="form-group">
          <label>Nombre</label>
          <div className="input-action-row">
            {editingField === "nombre" ? (
              <>
                <input
                  type="text"
                  className="settings-input active"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                />
                <div className="action-buttons">
                  <button type="button" className="btn-icon save" onClick={() => handleSave("nombre")}>
                    <FaSave />
                  </button>
                  <button type="button" className="btn-icon cancel" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="read-only-value">{user.nombre || "No especificado"}</div>
                <button type="button" className="btn-icon edit" onClick={() => handleEdit("nombre")} title="Editar Nombre">
                  <FaRegEdit />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Campo Apellido */}
        <div className="form-group">
          <label>Apellido</label>
          <div className="input-action-row">
            {editingField === "apellido" ? (
              <>
                <input
                  type="text"
                  className="settings-input active"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                />
                <div className="action-buttons">
                  <button type="button" className="btn-icon save" onClick={() => handleSave("apellido")}>
                    <FaSave />
                  </button>
                  <button type="button" className="btn-icon cancel" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="read-only-value">{user.apellido || "No especificado"}</div>
                <button type="button" className="btn-icon edit" onClick={() => handleEdit("apellido")} title="Editar Apellido">
                  <FaRegEdit />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Campo Teléfono */}
        <div className="form-group">
          <label>Teléfono</label>
          <div className="input-action-row">
            {editingField === "telefono" ? (
              <>
                <input
                  type="text"
                  className="settings-input active"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                />
                <div className="action-buttons">
                  <button type="button" className="btn-icon save" onClick={() => handleSave("telefono")}>
                    <FaSave />
                  </button>
                  <button type="button" className="btn-icon cancel" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="read-only-value">{user.telefono || "No especificado"}</div>
                <button type="button" className="btn-icon edit" onClick={() => handleEdit("telefono")} title="Editar Teléfono">
                  <FaRegEdit />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Campo Email */}
        <div className="form-group">
          <label>Email (No editable)</label>
          <div className="input-action-row">
            <div className="read-only-value disabled">{maskEmail(user.email)}</div>
          </div>
        </div>
      </div>

      {/* Sección Seguridad */}
      <div className="settings-card">
        <h3 className="settings-card-title">Seguridad</h3>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              className="settings-input"
              value={passwords.passwordActual}
              onChange={(e) => setPasswords({ ...passwords, passwordActual: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              className="settings-input"
              value={passwords.passwordNueva}
              onChange={(e) => setPasswords({ ...passwords, passwordNueva: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              className="settings-input"
              value={passwords.confirmarPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmarPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}