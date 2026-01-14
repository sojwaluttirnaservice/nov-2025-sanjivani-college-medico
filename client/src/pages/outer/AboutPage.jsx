import React from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Heart, Shield, Users, Award, Target, Zap, CheckCircle, TrendingUp } from 'lucide-react'

const AboutPage = () => {
    const app = useSelector(state => state.app)

    const values = [
        {
            icon: Heart,
            title: "Patient-Centric Care",
            description: "Every decision we make prioritizes the health and wellbeing of our community members.",
            color: "teal"
        },
        {
            icon: Shield,
            title: "Trust & Transparency",
            description: "Building lasting relationships through honest communication and reliable service delivery.",
            color: "emerald"
        },
        {
            icon: Zap,
            title: "Innovation First",
            description: "Leveraging cutting-edge technology to revolutionize healthcare accessibility and efficiency.",
            color: "cyan"
        },
        {
            icon: Award,
            title: "Excellence Always",
            description: "Committed to maintaining the highest standards in every aspect of our healthcare ecosystem.",
            color: "teal"
        }
    ]

    const team = [
        {
            name: "Dr. Sarah Johnson",
            role: "Chief Medical Officer",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
        },
        {
            name: "Michael Chen",
            role: "Head of Technology",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        },
        {
            name: "Emily Rodriguez",
            role: "Operations Director",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
        },
        {
            name: "David Kumar",
            role: "Pharmacy Relations",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        }
    ]

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-teal-50 to-emerald-50 py-20 lg:py-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-teal-700 uppercase bg-teal-100 rounded-full">
                            About {app.name}
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900">
                            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Healthcare Access</span> for Everyone
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                            We're on a mission to bridge the gap between healthcare providers and communities, making quality medical services accessible, affordable, and efficient.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="group p-10 rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To create a seamless healthcare ecosystem that connects citizens, medical stores, and agencies through innovative technology. We strive to eliminate barriers in accessing essential medicines and healthcare services, ensuring no one is left behind.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="group p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To become the most trusted healthcare platform nationwide, where every citizen can find their needed medicines instantly, every pharmacy thrives digitally, and every agency operates with maximum efficiency—all powered by compassion and technology.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-gray-50">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and every decision we make.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 bg-${value.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${value.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Impact in Numbers
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Real results that demonstrate our commitment to transforming healthcare.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "500+", label: "Partner Pharmacies", color: "teal" },
                            { number: "50k+", label: "Active Users", color: "emerald" },
                            { number: "100+", label: "Healthcare Agencies", color: "cyan" },
                            { number: "98%", label: "Satisfaction Rate", color: "teal" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-200 transition-all duration-300">
                                <p className={`text-5xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}</p>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Leadership Team
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Passionate professionals dedicated to revolutionizing healthcare delivery.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="aspect-square overflow-hidden bg-gray-200">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-teal-600 font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose {app.name}?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're more than just a platform—we're your healthcare partner.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            "Verified and trusted pharmacy network",
                            "Real-time medicine availability tracking",
                            "Secure and private health data management",
                            "24/7 customer support and assistance",
                            "Competitive pricing and exclusive deals",
                            "Fast and reliable delivery services"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-teal-50 transition-colors duration-300">
                                <CheckCircle className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                                <p className="text-gray-700 font-medium">{feature}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-teal-900/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[128px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] opacity-20"></div>

                <Container>
                    <div className="text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Join Our Healthcare Revolution</h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Be part of a community that's making healthcare accessible to everyone.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-colors duration-300">
                                Get Started Today
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-gray-600 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors duration-300">
                                Contact Our Team
                            </button>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default AboutPage