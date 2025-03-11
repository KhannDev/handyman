import { useRouter } from "next/router";
import MenuItem from "../MenuItem";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar(props: SidebarProps) {
  const { showSidebar, setShowSidebar } = props;
  const { role, permissions } = useAuth();
  const { pathname } = useRouter();

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  console.log("Permissions", permissions);

  // Function to check if the user has permission
  const hasPermission = (permissionName: string) => {
    return permissions?.some(
      (perm: any) => perm.name === permissionName && perm.isAllowed
    );
  };

  return (
    <div
      className={`fixed bottom-0 top-16 z-20 flex overflow-hidden transition-width duration-200 md:relative md:top-0 md:z-0 md:w-48 ${
        showSidebar ? "w-full md:w-48" : "w-0"
      }`}
    >
      <div className="flex h-full w-5/6 min-w-max flex-col overflow-y-scroll bg-gray-100 py-4 md:w-48">
        <div className="flex flex-col gap-4">
          <MenuItem
            active={pathname === "/"}
            icon="fa-solid fa-gauge"
            title="Overview"
            href="/"
          />

          {hasPermission("view:admins") && (
            <MenuItem
              active={pathname.includes("/admins")}
              href="/admins"
              icon="fa-solid fa-users"
              title="Manage Access"
            />
          )}

          {hasPermission("view:users") && (
            <MenuItem
              active={pathname.includes("/users")}
              href="/users"
              icon="fa-solid fa-users"
              title="Users"
            />
          )}

          {hasPermission("view:partners") && (
            <MenuItem
              title="Partners"
              icon="fa-solid fa-user-tie"
              href="/partners"
              active={pathname.includes("/partners")}
            />
          )}
          {hasPermission("view:branches") && (
            <MenuItem
              title="Branches"
              icon="fa-solid fa-building"
              href="/branches"
              active={pathname.includes("/branches")}
            />
          )}
          {hasPermission("view:categories") && (
            <MenuItem
              title="Categories"
              icon="fa-solid fa-list"
              href="/categories"
              active={pathname.includes("/categories")}
            />
          )}

          {hasPermission("view:services") && (
            <MenuItem
              title="Services"
              icon="fa-solid fa-concierge-bell"
              href="/services"
              active={pathname.includes("/services")}
            />
          )}

          {hasPermission("view:bookings") && (
            <MenuItem
              title="Bookings"
              icon="fa-solid fa-calendar-check"
              href="/bookings"
              active={pathname.includes("/bookings")}
            />
          )}
        </div>
      </div>

      <div
        className="h-full flex-1 bg-black opacity-70 duration-0 md:hidden"
        onClick={() => setShowSidebar(false)}
      />
    </div>
  );
}

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
