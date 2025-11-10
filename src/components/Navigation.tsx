import { Link } from "react-router-dom";

const categories = [
  { name: "Home", path: "/" },
  { name: "Lifestyle", path: "/category/lifestyle" },
  { name: "Education", path: "/category/education" },
  { name: "Wellness", path: "/category/wellness" },
  { name: "Deals", path: "/category/deals" },
  { name: "Job Seeking", path: "/category/job-seeking" },
  { name: "Alternative Learning", path: "/category/alternative-learning" },
];

export const Navigation = () => {
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            DramaOrbitZone
          </Link>
          <div className="hidden md:flex space-x-6">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="text-foreground hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
