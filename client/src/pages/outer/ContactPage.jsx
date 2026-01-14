import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from 'lucide-react'

const ContactPage = () => {
    const app = useSelector(state => state.app)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
        alert('Thank you for contacting us! We will get back to you soon.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }

    const contactInfo = [
        {
            icon: Phone,
            title: "Call Us",
            details: ["+1 (234) 567-8900", "+1 (234) 567-8901"],
            color: "teal"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["contact@medoplus.com", "support@medoplus.com"],
            color: "emerald"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["123 Medical Center Dr", "Healthcare City, HC 90210"],
            color: "cyan"
        },
        {
            icon: Clock,
            title: "Working Hours",
            details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
            color: "teal"
        }
    ]

    const faqs = [
        {
            question: "How quickly can I get a response?",
            answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our hotline."
        },
        {
            question: "Can I visit your office in person?",
            answer: "Yes! We welcome visitors during our working hours. Please schedule an appointment for a better experience."
        },
        {
            question: "Do you provide 24/7 support?",
            answer: "Our online platform is available 24/7. For customer support, we're available during business hours with emergency support on-call."
        },
        {
            question: "How can I partner with MedoPlus?",
            answer: "We'd love to partner with you! Please fill out the contact form mentioning 'Partnership' in the subject, and our team will reach out."
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
                            Get In Touch
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900">
                            We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Hear From You</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                            Have questions, feedback, or partnership inquiries? Our team is here to help you every step of the way.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Contact Info Cards */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 bg-${info.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${info.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                    <info.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 leading-relaxed">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Contact Form & Map Section */}
            <section className="py-24 bg-gray-50">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Send us a Message</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300"
                                            placeholder="+1 (234) 567-8900"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300"
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300 resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Map & Additional Info */}
                        <div className="space-y-8">
                            {/* Map Placeholder */}
                            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Us Here</h3>
                                    <p className="text-gray-600 mb-4">123 Medical Center Dr<br />Healthcare City, HC 90210</p>
                                    <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors duration-300">
                                        Get Directions
                                    </button>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-10 rounded-3xl shadow-xl text-white">
                                <h3 className="text-2xl font-bold mb-4">Emergency Support</h3>
                                <p className="text-teal-50 mb-6 leading-relaxed">
                                    Need urgent assistance? Our emergency support team is available 24/7 for critical healthcare needs.
                                </p>
                                <div className="flex items-center gap-3 mb-4">
                                    <Phone className="w-6 h-6" />
                                    <span className="text-xl font-bold">+1 (234) 567-HELP</span>
                                </div>
                                <button className="px-6 py-3 bg-white text-teal-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                                    Call Emergency Line
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-teal-700 uppercase bg-teal-100 rounded-full">
                            <HelpCircle className="w-4 h-4" />
                            FAQ
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Quick answers to common questions about contacting us.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                                    <span className="text-teal-600 shrink-0">Q:</span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 leading-relaxed pl-8">
                                    <span className="text-emerald-600 font-semibold">A:</span> {faq.answer}
                                </p>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Still Have Questions?</h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Our team is always ready to assist you. Don't hesitate to reach out!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-colors duration-300">
                                Schedule a Call
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-gray-600 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors duration-300">
                                Browse Help Center
                            </button>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default ContactPage