import {
  IconBellRinging,
  IconLogout,
  IconCalendar,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import classes from "./index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = [
  { link: "/", label: "Главная", icon: IconBellRinging },
  { link: "/calendar", label: "Календарь", icon: IconCalendar },
];

export function Navbar() {
  const pathname = usePathname();

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
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
