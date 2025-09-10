import React from "react";
import ProductRegistrationForm from "../../../components/CreateProducts";
import Layout from "@/components/Layout";

const RegisterProductPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <ProductRegistrationForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterProductPage;
