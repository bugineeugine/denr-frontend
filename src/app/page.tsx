import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-green-50 to-emerald-100 min-h-screen">
      <header className="bg-white shadow-lg border-b-4 border-denr-green">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-denr-green rounded-full flex items-center justify-center">
                <Image
                  src={"/denr.png"}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 rounded-full bg-white p-2"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-denr-green">DENR - CENRO</h1>
                <p className="text-sm text-gray-600">Department of Environment and Natural Resources</p>
                <p className="text-xs text-gray-500">Community Environment and Natural Resources Office</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#home" className="text-denr-green hover:text-denr-light-green font-medium transition-colors">
                Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-denr-green font-medium transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-denr-green font-medium transition-colors">
                About
              </a>
              <Link href="/login" className="text-gray-700 hover:text-denr-green font-medium transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-denr-green mb-6 leading-tight">
              Centralized Permit Verification System
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              for Local Transport with Data Analytics and Virtualization
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
              Streamlining environmental compliance for local transport operations through advanced digital
              verification, comprehensive data analytics, and innovative virtualization technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-denr-green hover:bg-denr-light-green text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Verify Permits
              </button>
              <button className="border-2 border-denr-green text-denr-green hover:bg-denr-green hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-denr-green mb-4">System Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology solutions for efficient permit management and environmental monitoring
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Permit Verification */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-denr-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-denr-green mb-4">Permit Verification</h3>
              <p className="text-gray-600 mb-4">
                Real-time verification of transport permits with secure digital authentication and instant status
                updates.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-denr-green rounded-full mr-2" />
                  Instant verification
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-denr-green rounded-full mr-2" />
                  Digital certificates
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-denr-green rounded-full mr-2" />
                  QR code scanning
                </li>
              </ul>
            </div>
            {/* Data Analytics */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Data Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive analytics dashboard with insights on permit trends, compliance rates, and environmental
                impact.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Interactive dashboards
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Compliance reporting
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Trend analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-denr-green mb-8">About the System</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              The Centralized Permit Verification System represents a groundbreaking approach to environmental
              compliance in the transport sector. Developed specifically for DENR-CENRO operations, this system combines
              cutting-edge technology with environmental stewardship to ensure sustainable transport practices across
              local communities.
            </p>
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-denr-green mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To streamline environmental permit processes while maintaining the highest standards of environmental
                  protection and regulatory compliance through innovative digital solutions.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-denr-green mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A future where environmental compliance is seamlessly integrated into transport operations, promoting
                  sustainable development and environmental conservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-denr-green text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DENR - CENRO</h3>
              <p className="text-green-200 text-sm">
                Department of Environment and Natural Resources
                <br />
                Community Environment and Natural Resources Office
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-green-200 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Permit Verification
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Data Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Compliance Monitoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Environmental Assessment
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-200 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    User Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Downloads
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="text-green-200 text-sm space-y-2">
                <p>📧 info@denr-cenro.gov.ph</p>
                <p>📞 (02) 8929-6626</p>
                <p>
                  📍 DENR Central Office
                  <br />
                  Visayas Avenue, Quezon City
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-8 text-center text-green-200 text-sm">
            <p>
              © {/*?php echo date('Y'); ?*/} Department of Environment and Natural Resources - CENRO. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
