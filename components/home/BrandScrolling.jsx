import styles from "@/styles/client/home.module.css";

const BRANDS = ["Honda", "Yamaha", "Suzuki", "Brembo", "Ohlins", "Akrapovic"];

export default function BrandScrolling() {
  return (
    <div className="bg-light py-5 mt-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-5 opacity-50">
          {BRANDS.map((brand) => (
            <h3 key={brand} style={{ fontStyle: 'italic', fontWeight: 900, color: '#000' }}>{brand}</h3>
          ))}
        </div>
      </div>
    </div>
  );
}
