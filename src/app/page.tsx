// app/page.jsx
import Hero from "../components/Hero";
import Services from "../components/Services";
import AboutUs from "../components/AboutUs";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import ContactBooking from "../components/ContactBooking";

export default function Home() {
  return (
    <main id="main-content" className="w-full overflow-x-hidden scroll-smooth">

      {/* --- HERO SECTION --- */}
      <section id="hero" className="pt-0">
        <Hero />
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services">
        <Services />
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section id="about">
        <AboutUs />
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section id="whychooseus">
        <WhyChooseUs />
      </section>

      {/* --- REVIEWS SECTION --- */}
      <section id="reviews">
        <Reviews />
      </section>

      {/* --- CONTACT / BOOKING SECTION --- */}
      <section id="contact">
        <ContactBooking />
      </section>

    </main>
  );
}
