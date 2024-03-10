import { examplePaths } from "@/routes/paths";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function PrivateLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <header className="p-4">
        <nav>
          <ul className="flex gap-4 items-center justify-center">
            <li>
              <Link href={examplePaths.client()}>Client</Link>
            </li>
            <li>
              <Link href={examplePaths.server()}>Server</Link>
            </li>
            <li>
              <Link href={examplePaths.admin()}>Admin</Link>
            </li>
            <li>
              <Link href={examplePaths.profile()}>Profile</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>;
    </>
  );
}
