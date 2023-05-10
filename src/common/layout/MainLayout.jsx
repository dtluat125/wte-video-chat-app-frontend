import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  );
}

export default MainLayout;
