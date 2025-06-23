import React from 'react';
import ProductRegistrationForm from '../../../components/CreateProducts'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

const RegisterProductPage: React.FC = () => {
    return (
        <>
            <Header />
                <div className="min-h-screen bg-gray-100 py-8">
                    <div className="container mx-auto">
                        <ProductRegistrationForm />
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default RegisterProductPage;