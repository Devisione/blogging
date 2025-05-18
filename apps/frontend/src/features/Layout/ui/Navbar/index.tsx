import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBellRinging, IconCalendar, IconLogout, IconUser } from "@tabler/icons-react";
import { useUnit } from "effector-react";
import { Avatar, Group, Text } from "@mantine/core";
import { $userState } from "@entities/User/model/store";
import classes from "./index.module.css";

const data = [
  { link: "/", label: "Главная", icon: IconBellRinging },
  { link: "/calendar", label: "Календарь", icon: IconCalendar },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { data: user } = useUnit($userState);

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.link === pathname || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        {user ? (
          <>
            <Link
              className={classes.link}
              data-active={pathname === "/profile" || undefined}
              href="/profile"
            >
              <Group gap="sm" style={{ flex: 1 }}>
                <Avatar 
                  alt={user.name} 
                  radius="xl" 
                  size="sm"
                >
                  <IconUser size={20} />
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text fw={500} size="sm" truncate="end">
                    {user.name}
                  </Text>
                </div>
              </Group>
            </Link>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- временно */}
            <a
              className={classes.link}
              href="#"
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </>
        ) : (
          <a
            className={classes.link}
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Login via Google</span>
          </a>
        )}
      </div>
    </nav>
  );
};
