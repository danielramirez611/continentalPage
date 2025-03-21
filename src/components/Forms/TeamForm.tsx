import React, { useState, useRef } from "react";
import { ProjectData, TeamMember } from "../../data/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

interface TeamFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ project, setProject }) => {
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMember({ ...newMember, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.bio && newMember.avatar) {
      const updatedTeam = [...project.team, newMember as TeamMember];
      setProject({
        ...project,
        team: updatedTeam,
        showTeam: updatedTeam.length > 0,
      });
      setNewMember({}); // Limpiar el formulario
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  const handleDeleteMember = (index: number) => {
    const newTeam = project.team.filter((_, i) => i !== index);
    setProject({ ...project, team: newTeam });
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeam = [...project.team];
    updatedTeam[index] = { ...updatedTeam[index], [field]: value };
    setProject({ ...project, team: updatedTeam });
  };

  return (
    <div className="space-y-8">
      {/* Lista de Miembros Existentes */}
      <AnimatePresence>
      {project.team?.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h4>
              <button
                onClick={() => handleDeleteMember(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subida de Avatar */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Avatar
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateMember(index, "avatar", reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id={`avatar-upload-${index}`}
                  />
                  <label
                    htmlFor={`avatar-upload-${index}`}
                    className="cursor-pointer text-primary hover:text-primary-dark"
                  >
                    {member.avatar ? "Cambiar Avatar" : "Subir Avatar"}
                  </label>
                  {member.avatar && (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="mt-4 rounded-lg max-h-40 mx-auto"
                    />
                  )}
                </div>
              </div>

              {/* Campos Editables */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Nombre
                  </label>
                  <input
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Rol
                  </label>
                  <input
                    value={member.role}
                    onChange={(e) =>
                      updateMember(index, "role", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Biografía
                  </label>
                  <textarea
                    value={member.bio}
                    onChange={(e) =>
                      updateMember(index, "bio", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Formulario para Nuevo Miembro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Agregar Nuevo Miembro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subida de Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Avatar
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                id="new-avatar-upload"
              />
              <label
                htmlFor="new-avatar-upload"
                className="cursor-pointer text-primary hover:text-primary-dark"
              >
                {newMember.avatar ? "Cambiar Avatar" : "Subir Avatar"}
              </label>
              {newMember.avatar && (
                <img
                  src={newMember.avatar}
                  alt="Nuevo miembro"
                  className="mt-4 rounded-lg max-h-40 mx-auto"
                />
              )}
            </div>
          </div>

          {/* Campos del Nuevo Miembro */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Nombre
              </label>
              <input
                value={newMember.name || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Rol
              </label>
              <input
                value={newMember.role || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Biografía
              </label>
              <textarea
                value={newMember.bio || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, bio: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Botón de Agregar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 bg-primario text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition"
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Miembro
          </button>
        </div>
      </motion.div>
       </div>
  );
};

export default TeamForm;