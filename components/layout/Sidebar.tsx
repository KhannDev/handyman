import { useRouter } from "next/router";
import MenuItem from "../MenuItem";
import React, { useEffect } from "react";

export default function Sidebar(props: SidebarProps) {
  const { showSidebar, setShowSidebar } = props;

  const { pathname } = useRouter();

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

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

          <MenuItem
            active={pathname.includes("/users")}
            href="/users"
            icon="fa-solid fa-users"
            title="Users"
          />

          <MenuItem
            title="Partners"
            icon="fa-solid fa-user-tie"
            href="/partners"
            active={pathname.includes("/partners")}
          />

          <MenuItem
            title="bookings"
            icon="fa-solid fa-user-tie"
            href="/bookings"
            active={pathname.includes("/bookings")}
          />

          {/* <MenuItem
            active={pathname.includes("/information")}
            icon="fa-solid fa-info-circle"
            title="Information"
          >
            <MenuItem.SubItem
              active={pathname === "/information/about"}
              href="/information/about"
              title="About"
            />

            <MenuItem.SubItem
              active={pathname === "/information/privacy-policy"}
              href="/information/privacy-policy"
              title="Privacy Policy"
            />

            <MenuItem.SubItem
              active={pathname === "/information/terms-of-use"}
              href="/information/terms-of-use"
              title="Terms of Use"
            />

            <MenuItem.SubItem
              active={pathname === "/information/frequently-asked-questions"}
              href="/information/frequently-asked-questions"
              title="FAQs"
            />
          </MenuItem>
          <MenuItem
            title="Reports"
            icon="fas fa-file-text"
            active={pathname.includes("/reports")}
          >
            <MenuItem.SubItem
              title="Call logs"
              href="/reports/call-logs"
              active={pathname === "/reports/call-logs"}
            />
            <MenuItem.SubItem
              title="Login"
              href="/reports/login"
              active={
                pathname === "/reports/login" ||
                pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Active/Inactive"
              href="/reports/activity"
              active={
                pathname === "/reports/activity" ||
                pathname === "/reports/activity/dates" ||
                pathname === "/reports/activity/toggledata"
              }
            />

            <MenuItem.SubItem
              title="Privacy Policy"
              href="/reports/privacy"
              active={
                pathname === "/reports/privacy" ||
                pathname === "/reports/privacy/userPrivacy"
              }
            />
            <MenuItem.SubItem
              title="Terms of Use"
              href="/reports/terms"
              active={
                pathname === "/reports/terms" ||
                pathname === "/reports/terms/userTerms"
              }
            />
          </MenuItem>
          <MenuItem
            title="Notifications"
            icon="fas fa-bell"
            active={pathname.includes("/notifications")}
            href="/notifications"
          ></MenuItem>
          <MenuItem
            title="Misc"
            icon="fa-solid fa-star"
            active={pathname.includes("/misc")}
          >
            <MenuItem.SubItem
              title="Banner-Audio"
              href="/misc/banner/banner-audio"
              active={
                pathname === "/misc/banner"
                // pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Banner-Video"
              href="/misc/banner/banner-video"
              active={
                pathname === "/misc/banner"
                // pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Cancelled Appointments"
              href="/misc/Appointment/cancelledAppointments"
              active={
                pathname === "/misc/Appointment/cancelledAppointments"
                // pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Deleted Users"
              href="/misc/deletedUsers"
              active={
                pathname === "/misc/deletedUsers"
                // pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Admin History"
              href="/misc/adminHistory"
              active={
                pathname === "/misc/adminHistory"
                // pathname === "/reports/login/userLogin"
              }
            />
          </MenuItem>
          <MenuItem
            title="Tutorial"
            icon="fas fa-video"
            active={pathname.includes("/content")}
          >
            <MenuItem.SubItem
              title="Labels"
              href="/content/categories"
              active={
                pathname === "/content/categories"
                // pathname === "/reports/login/userLogin"
              }
            />
            <MenuItem.SubItem
              title="Content"
              href="/content"
              active={
                pathname === "/content"
                // pathname === "/reports/login/userLogin"
              }
            />
          </MenuItem> */}
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
