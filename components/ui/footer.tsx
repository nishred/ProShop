import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-solid border-slate-300 py-3">
      <div className="wrapper text-center">
        {currentYear} {APP_NAME} All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
