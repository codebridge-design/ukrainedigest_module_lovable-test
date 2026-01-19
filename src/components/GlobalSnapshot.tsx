import { useState } from "react";
import { Eye, LayoutGrid, List } from "lucide-react";
import { articles, countries, regions, getArticlesByCountry, getArticlesByRegion, getCountriesByRegion } from "@/data/mockData";
import RegionFilter from "./RegionFilter";
import ArticleCard from "./ArticleCard";
import CountryCard from "./CountryCard";
import ComparisonView from "./ComparisonView";

type ViewMode = "articles" | "countries";

const GlobalSnapshot = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("articles");
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);

  const filteredArticles = selectedCountry
    ? getArticlesByCountry(selectedCountry)
    : selectedRegion
    ? getArticlesByRegion(selectedRegion)
    : articles;

  const filteredCountries = selectedRegion
    ? getCountriesByRegion(selectedRegion)
    : countries;

  const handleCountryClick = (countryCode: string) => {
    if (comparisonCountries.includes(countryCode)) {
      setComparisonCountries(comparisonCountries.filter((c) => c !== countryCode));
    } else if (comparisonCountries.length < 2) {
      setComparisonCountries([...comparisonCountries, countryCode]);
    }
  };

  const handleRemoveFromComparison = (countryCode: string) => {
    setComparisonCountries(comparisonCountries.filter((c) => c !== countryCode));
  };

  const comparisonCountryData = countries.filter((c) =>
    comparisonCountries.includes(c.code)
  );

  return (
    <div className="container-wide py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Today's Global Snapshot
        </h2>
        <p className="text-body max-w-2xl">
          How the world is covering Ukraine today. Browse by region or country to compare
          perspectives across international media.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <strong className="text-foreground">{articles.length}</strong> articles from{" "}
            <strong className="text-foreground">{countries.length}</strong> countries
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground mr-2">View:</span>
          <button
            onClick={() => setViewMode("articles")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "articles"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            aria-label="Article view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("countries")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "countries"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            aria-label="Country view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <RegionFilter
          selectedRegion={selectedRegion}
          selectedCountry={selectedCountry}
          onRegionChange={setSelectedRegion}
          onCountryChange={setSelectedCountry}
        />
      </div>

      {/* Comparison View */}
      {comparisonCountries.length > 0 && (
        <ComparisonView
          countries={comparisonCountryData}
          onRemoveCountry={handleRemoveFromComparison}
          onClose={() => setComparisonCountries([])}
        />
      )}

      {/* Content */}
      {viewMode === "articles" ? (
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found for the selected filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.code}
              country={country}
              onClick={() => handleCountryClick(country.code)}
              isSelected={comparisonCountries.includes(country.code)}
            />
          ))}
        </div>
      )}

      {/* Comparison hint */}
      {viewMode === "countries" && comparisonCountries.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Click on countries to compare their coverage side by side
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalSnapshot;
