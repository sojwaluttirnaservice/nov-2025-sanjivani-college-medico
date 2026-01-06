import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Building, StickyNote, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, linkText, linkHref, color }) => {
    return (
        <div
            className={`group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 
                hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-${color}-100/50`}
        >
            <div
                className={`w-14 h-14 bg-${color}-100 rounded-2xl flex items-center justify-center mb-6 
                    text-${color}-600 group-hover:scale-110 transition-transform duration-300`}
            >
                <Icon />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

            <a href={linkHref} className={`flex items-center text-${color}-600 font-semibold hover:text-${color}-700`}>
                {linkText}
                <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    );
};



const HomePage = () => {

    const app = useSelector(state => state.app)

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-teal-50 to-emerald-50 py-20 lg:py-32 overflow-hidden">

                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse z-30">dff</div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

                <Container>
                    <div className="text-center">


                        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-teal-700 uppercase bg-teal-100 rounded-full">
                            Welcome to {app.name}
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900">
                            Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Healthcare Ecosystem</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Connect seamlessly with trusted medical stores, agencies, and healthcare services in your community.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">

                            <button className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                Find Medicines
                            </button>
                            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300">
                                Register as Partner
                            </button>

                        </div>

                        {/* Stats Preview */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-200/50 pt-10">
                            <div>
                                <p className="text-4xl font-bold text-teal-600">500+</p>
                                <p className="text-gray-500 font-medium">Medical Stores</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-emerald-600">50k+</p>
                                <p className="text-gray-500 font-medium">Happy Citizens</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-cyan-600">100+</p>
                                <p className="text-gray-500 font-medium">Agencies</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-teal-500">24/7</p>
                                <p className="text-gray-500 font-medium">Support</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Features/Services Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Who is {app.name} For?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A unified platform serving everyone in the healthcare supply chain.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Features Card */}
                        {
                            [
                                {
                                    icon: Users,
                                    title: "For Citizens",
                                    description:
                                        "Find medicines nearby, book appointments, and access health records instantly. Your health, simplified.",
                                    linkText: "Learn More",
                                    linkHref: "#",
                                    color: "teal",
                                },
                                {
                                    icon: Building,
                                    title: "For Medical Stores",
                                    description:
                                        "Manage inventory, track orders, and reach more local customers. Grow your pharmacy business digitally.",
                                    linkText: "Partner Dashboard",
                                    linkHref: "#",
                                    color: "emerald",
                                },
                                {
                                    icon: StickyNote,
                                    title: "For Agencies",
                                    description:
                                        "Streamline distribution, manage supply chains, and connect with pharmacies efficiently.",
                                    linkText: "Agency Portal",
                                    linkHref: "#",
                                    color: "cyan",
                                },
                            ].map((card, index) => (
                                <FeatureCard key={index} {...card} />
                            ))
                        }

                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-teal-900/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[128px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] opacity-20"></div>

                <Container>
                    <div className="text-center">


                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to simplify your healthcare?</h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of citizens, pharmacists, and agencies on MedoPlus today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-colors duration-300">
                                Get Started Now
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-gray-600 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors duration-300">
                                Download App
                            </button>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default HomePage