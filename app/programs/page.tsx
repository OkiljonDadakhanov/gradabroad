"use client";

import { useState, useEffect } from "react";
import { PublicProgram, ProgramFilters, ProgramsResponse } from "@/types/program";
import { fetchPublic } from "@/lib/fetchWithAuth";
import { ENDPOINTS } from "@/lib/constants";
import { ProgramCard } from "@/components/programs/program-card";
import { ProgramFiltersPanel } from "@/components/programs/program-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, GraduationCap, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProgramFilters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    page: 1,
  });

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  async function fetchPrograms(url?: string) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.degree_type) params.append("degree_type", filters.degree_type);
      if (filters.field_of_study) params.append("field_of_study", filters.field_of_study);
      if (filters.min_price) params.append("min_price", filters.min_price.toString());
      if (filters.max_price) params.append("max_price", filters.max_price.toString());

      const fetchUrl = url || `${ENDPOINTS.PROGRAMS}?${params.toString()}`;
      const res = await fetchPublic(fetchUrl);

      if (!res.ok) {
        throw new Error("Failed to fetch programs");
      }

      const data: ProgramsResponse = await res.json();
      setPrograms(data.results || []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page: url ? (url.includes("page=") ? parseInt(url.split("page=")[1]) : 1) : 1,
      });
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError("Failed to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-purple-700" />
              <span className="font-bold text-xl text-gray-900">K-GradAbroad</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/programs" className="text-purple-700 font-medium">
                Programs
              </Link>
              <Link href="https://www.gradabroad.net/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="https://www.gradabroad.net/register">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Program</h1>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl">
            Explore graduate programs at top Korean universities. Your journey to
            studying in Korea starts here.
          </p>

          {/* Quick Search */}
          <div className="max-w-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setFilters({ ...filters, search: formData.get("search") as string });
              }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  name="search"
                  placeholder="Search programs, universities..."
                  className="pl-10 bg-white text-gray-900"
                  defaultValue={filters.search}
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProgramFiltersPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Programs Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? "Loading..." : `${pagination.count} Programs Found`}
                </h2>
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <ProgramFiltersPanel filters={filters} onFiltersChange={setFilters} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Programs Grid */}
            {!loading && programs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>

                {/* Pagination */}
                {(pagination.next || pagination.previous) && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      disabled={!pagination.previous}
                      onClick={() => pagination.previous && fetchPrograms(pagination.previous)}
                    >
                      <ChevronLeft size={18} className="mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {Math.ceil(pagination.count / 10)}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!pagination.next}
                      onClick={() => pagination.next && fetchPrograms(pagination.next)}
                    >
                      Next
                      <ChevronRight size={18} className="ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && programs.length === 0 && !error && (
              <div className="text-center py-16">
                <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No programs found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-purple-700" />
              <span className="font-semibold text-gray-900">K-GradAbroad</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} K-GradAbroad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
