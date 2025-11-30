// app/page.jsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import AboutUs from "../components/AboutUs";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import ContactBooking from "../components/ContactBooking";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      {/* <Header /> */}

      <section id="hero">
        <Hero />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <section id="whychooseus">
        <WhyChooseUs />
      </section>

      <section id="reviews">
        <Reviews />
      </section>

      <section id="contact">
        <ContactBooking />
      </section>

      {/* <Footer /> */}
    </>
  );
}
