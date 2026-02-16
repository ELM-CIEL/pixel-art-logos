import LogoGrid from "./LogoGrid";

export default function Page({ isDark }) {
  return (
    <main>
      <LogoGrid isDark={isDark} />
    </main>
  );
}
