import React from "react";
import toast from "react-hot-toast";

import Footer from "./ui/footer/Footer";
import Header from "./ui/header/Header";
import Button from "./ui/button/Button";

export default function ErrorPage({ error, resetErrorBoundary }) {
  console.log(error);
  return (
    <div className="flex flex-col min-h-screen">
      {toast.error(error.message)}
      <Header />
      <main className="wrapper grow min-h-[40vh] mt-24 place-content-center gap-6 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl text-primary mb-2">
            Oops! An error occured...
          </h1>
          <p className="sm:text-2xl text-textHead">{error.message}</p>
        </div>
        <Button
          onClick={() => resetErrorBoundary()}
          className={`py-5 text-2xl font-semibold min-w-[200px] hover:shadow-2xl`}
        >
          Reload page
        </Button>
      </main>
      <Footer />
    </div>
  );
}
