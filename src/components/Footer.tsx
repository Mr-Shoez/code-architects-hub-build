
const Footer = () => {
  return (
    <footer className="bg-navy text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>
          <i className="fas fa-code mr-2 text-lime"></i>
          codeArchitects - Rosebank College
        </p>
        <p className="text-xs mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
