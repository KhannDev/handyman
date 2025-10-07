import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Role {
  _id: string;
  name: string;
  permissions: { name: string; isAllowed: boolean }[];
}

const PermissionsTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [updatedRoles, setUpdatedRoles] = useState<any>({});

  const axios = useAxiosPrivate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/adminRoles"); // Use your actual endpoint here
        const data = response.data;

        if (data.length > 0) {
          setRoles(data);

          // Collect all unique permission names across all roles
          const allPermissions: any[] = [
            ...new Set(
              data.flatMap((role: any) =>
                role.permissions.map((permission: any) => permission.name)
              )
            ),
          ];
          setPermissions(allPermissions);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, [axios]);

  const handleCheckboxChange = (roleId: string, permissionName: string) => {
    setUpdatedRoles((prev: any) => {
      // Get the current role from the updatedRoles state or fallback to the original roles array.
      const currentRole =
        prev[roleId] || roles.find((role: any) => role._id === roleId);

      // Ensure we have a cloned copy with a permissions array.
      const roleToUpdate = {
        ...currentRole,
        permissions: currentRole.permissions
          ? [...currentRole.permissions]
          : [],
      };

      // Try to find the permission object in the role's permissions array.
      const index = roleToUpdate.permissions.findIndex(
        (perm: any) => perm.name === permissionName
      );

      if (index === -1) {
        // If the permission object doesn't exist, add it with isAllowed = true.
        roleToUpdate.permissions.push({
          name: permissionName,
          isAllowed: true,
        });
      } else {
        // Otherwise, toggle the isAllowed value.
        roleToUpdate.permissions[index] = {
          ...roleToUpdate.permissions[index],
          isAllowed: !roleToUpdate.permissions[index].isAllowed,
        };
      }

      return { ...prev, [roleId]: roleToUpdate };
    });
  };

  const handleSubmit = async (roleId: string) => {
    if (!updatedRoles[roleId]) return; // Nothing to update

    const roleToSubmit = updatedRoles[roleId];

    try {
      // Send a PUT request to the API. The endpoint is /adminRoles/{roleId} and the payload
      // includes the role's name and its permissions array.
      await axios.put(`/adminRoles/${roleId}`, {
        name: roleToSubmit.name,
        permissions: roleToSubmit.permissions,
      });

      console.log(`Updated role ${roleToSubmit.name} successfully`);

      // Update local roles state to reflect the changes.
      setRoles((prevRoles) =>
        prevRoles.map((role) => (role._id === roleId ? roleToSubmit : role))
      );
      // Remove the role from updatedRoles after successful submission.
      setUpdatedRoles((prev: any) => {
        const { [roleId]: removed, ...rest } = prev;
        return rest;
      });

      toast.success("Access successfully Updated");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Role</th>
            {permissions.map((perm: any) => (
              <th key={perm} className="border p-2">
                {perm}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles
            .slice() // Clone array to avoid mutating state
            .sort((a, b) => {
              const order = ["Supervisor", "Manager", "Admin"];
              return order.indexOf(a.name) - order.indexOf(b.name);
            })
            .map((role: Role) => (
              <tr key={role._id} className="border">
                <td className="border p-2 font-bold">{role.name}</td>
                {permissions.map((perm: any) => {
                  const rolePermission =
                    updatedRoles[role._id]?.permissions.find(
                      (p: any) => p.name === perm
                    ) || role.permissions.find((p: any) => p.name === perm);

                  return (
                    <td key={perm} className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={rolePermission?.isAllowed || false}
                        onChange={() => handleCheckboxChange(role._id, perm)}
                        className="h-5 w-5 cursor-pointer"
                      />
                    </td>
                  );
                })}
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleSubmit(role._id)}
                    disabled={!updatedRoles[role._id]}
                    className={`px-4 py-2 rounded text-white ${
                      updatedRoles[role._id]
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsTable;
